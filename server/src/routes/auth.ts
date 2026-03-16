import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db";
import { authenticate, generateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, display_name } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    // Check existing
    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length) return res.status(409).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 12);
    const { rows } = await query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
      [email, hash]
    );
    const userId = rows[0].id;

    // Create profile
    await query(
      "INSERT INTO profiles (user_id, display_name) VALUES ($1, $2)",
      [userId, display_name || email]
    );

    // Assign default role
    await query("INSERT INTO user_roles (user_id, role) VALUES ($1, 'user')", [userId]);

    res.status(201).json({ message: "Account created" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const { rows } = await query("SELECT id, password_hash FROM users WHERE email = $1", [email]);
    if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    // Check if suspended
    const { rows: profileRows } = await query("SELECT account_status FROM profiles WHERE user_id = $1", [user.id]);
    if (profileRows[0]?.account_status === "suspended") {
      return res.status(403).json({ message: "Account suspended" });
    }

    const token = generateToken(user.id);

    // Get user data
    const { rows: profiles } = await query("SELECT display_name, avatar_url, bio FROM profiles WHERE user_id = $1", [user.id]);
    const { rows: roles } = await query("SELECT role FROM user_roles WHERE user_id = $1", [user.id]);

    res.json({
      token,
      user: {
        id: user.id,
        email,
        display_name: profiles[0]?.display_name,
        avatar_url: profiles[0]?.avatar_url,
        roles: roles.map((r) => r.role),
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const { rows } = await query(
      `SELECT u.id, u.email, p.display_name, p.avatar_url, p.bio, p.account_status
       FROM users u JOIN profiles p ON p.user_id = u.id WHERE u.id = $1`,
      [req.userId]
    );
    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const { rows: roles } = await query("SELECT role FROM user_roles WHERE user_id = $1", [req.userId]);

    res.json({
      ...rows[0],
      roles: roles.map((r) => r.role),
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
