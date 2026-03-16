import { Router } from "express";
import { query } from "../db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const { rows } = await query("SELECT * FROM categories ORDER BY sort_order");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
