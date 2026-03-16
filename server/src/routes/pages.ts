import { Router } from "express";
import { query } from "../db";

const router = Router();

// Get published page by slug (public)
router.get("/:slug", async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT * FROM site_pages WHERE slug = $1 AND is_published = true",
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ message: "Page not found" });
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
