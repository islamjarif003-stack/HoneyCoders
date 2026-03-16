import { Router } from "express";
import { query } from "../db";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { product_id } = req.body;
    await query(
      "INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2)",
      [req.userId, product_id]
    );
    res.status(201).json({ success: true });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Already in wishlist" });
    }
    res.status(500).json({ message: err.message });
  }
});

export default router;
