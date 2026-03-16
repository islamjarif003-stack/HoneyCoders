import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { query } from "../db";
import { authenticate, generateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, display_name } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length) return res.status(409).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { rows } = await query(
      `INSERT INTO users (email, password_hash, verification_token, verification_token_expires)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [email, hash, verificationToken, tokenExpires]
    );
    const userId = rows[0].id;

    await query("INSERT INTO profiles (user_id, display_name) VALUES ($1, $2)", [userId, display_name || email]);
    await query("INSERT INTO user_roles (user_id, role) VALUES ($1, 'user')", [userId]);

    // Build verification link
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    // Send email if nodemailer is configured
    try {
      const { sendVerificationEmail } = await import("../email");
      await sendVerificationEmail(email, verifyLink, display_name || email);
    } catch {
      console.log("Email service not configured. Verification link:", verifyLink);
    }

    res.status(201).json({ message: "Account created! Please check your email to verify your account." });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Verify email
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Token required" });

    const { rows } = await query(
      "SELECT id, email_verified, verification_token_expires FROM users WHERE verification_token = $1",
      [token]
    );
    if (!rows.length) return res.status(400).json({ message: "Invalid or expired token" });

    const user = rows[0];
    if (user.email_verified) return res.json({ message: "Email already verified" });

    if (new Date() > new Date(user.verification_token_expires)) {
      return res.status(400).json({ message: "Token expired. Please request a new verification email." });
    }

    await query(
      "UPDATE users SET email_verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = $1",
      [user.id]
    );

    res.json({ message: "Email verified successfully! You can now sign in." });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Resend verification
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const { rows } = await query("SELECT id, email_verified FROM users WHERE email = $1", [email]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    if (rows[0].email_verified) return res.json({ message: "Email already verified" });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await query(
      "UPDATE users SET verification_token = $1, verification_token_expires = $2 WHERE id = $3",
      [verificationToken, tokenExpires, rows[0].id]
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    try {
      const { sendVerificationEmail } = await import("../email");
      await sendVerificationEmail(email, verifyLink, email);
    } catch {
      console.log("Email service not configured. Verification link:", verifyLink);
    }

    res.json({ message: "Verification email sent! Please check your inbox." });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const { rows } = await query("SELECT id, password_hash, email_verified FROM users WHERE email = $1", [email]);
    if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    // Check email verification
    if (!user.email_verified) {
      return res.status(403).json({ message: "Please verify your email before signing in.", code: "EMAIL_NOT_VERIFIED" });
    }

    // Check if suspended
    const { rows: profileRows } = await query("SELECT account_status FROM profiles WHERE user_id = $1", [user.id]);
    if (profileRows[0]?.account_status === "suspended") {
      return res.status(403).json({ message: "Account suspended" });
    }

    const token = generateToken(user.id);

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

// Forgot password — send reset link
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const { rows } = await query("SELECT id FROM users WHERE email = $1", [email]);
    // Always return success to avoid email enumeration
    if (!rows.length) return res.json({ message: "If that email exists, a reset link has been sent." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await query(
      "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3",
      [resetToken, tokenExpires, rows[0].id]
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    try {
      const { sendPasswordResetEmail } = await import("../email");
      await sendPasswordResetEmail(email, resetLink);
    } catch {
      console.log("Email service not configured. Reset link:", resetLink);
    }

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Reset password — validate token and set new password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: "Token and new password required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const { rows } = await query(
      "SELECT id, reset_token_expires FROM users WHERE reset_token = $1",
      [token]
    );
    if (!rows.length) return res.status(400).json({ message: "Invalid or expired reset link" });

    if (new Date() > new Date(rows[0].reset_token_expires)) {
      return res.status(400).json({ message: "Reset link has expired. Please request a new one." });
    }

    const hash = await bcrypt.hash(password, 12);
    await query(
      "UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
      [hash, rows[0].id]
    );

    res.json({ message: "Password reset successfully! You can now sign in." });
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
