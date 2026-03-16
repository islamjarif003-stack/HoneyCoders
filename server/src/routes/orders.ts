import { Router } from "express";
import { query } from "../db";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// Get current user's orders
router.get("/mine", authenticate, async (req: AuthRequest, res) => {
  try {
    const { rows } = await query(
      `SELECT o.*, json_build_object('title', p.title, 'version', p.version, 'thumbnail_url', p.thumbnail_url, 'slug', p.slug) as products
       FROM orders o JOIN products p ON p.id = o.product_id
       WHERE o.buyer_id = $1 ORDER BY o.created_at DESC`,
      [req.userId]
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
