import { Router } from "express";
import { query } from "../db";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.put("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { display_name, bio, avatar_url } = req.body;
    await query(
      "UPDATE profiles SET display_name = $1, bio = $2, avatar_url = $3 WHERE user_id = $4",
      [display_name, bio, avatar_url, req.userId]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
