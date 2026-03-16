import { Router } from "express";
import { query } from "../db";

const router = Router();

// Get approved products (public)
router.get("/", async (req, res) => {
  try {
    const { category, q, featured } = req.query;
    let sql = `
      SELECT p.*, 
        json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'icon', c.icon, 'sort_order', c.sort_order) as categories,
        COALESCE(
          (SELECT json_agg(json_build_object('id', ps.id, 'url', ps.url, 'sort_order', ps.sort_order) ORDER BY ps.sort_order)
           FROM product_screenshots ps WHERE ps.product_id = p.id), '[]'
        ) as product_screenshots
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.status = 'approved'
    `;
    const params: any[] = [];
    let paramIdx = 1;

    if (category) {
      sql += ` AND c.slug = $${paramIdx++}`;
      params.push(category);
    }
    if (q) {
      sql += ` AND (p.title ILIKE $${paramIdx} OR p.description ILIKE $${paramIdx})`;
      params.push(`%${q}%`);
      paramIdx++;
    }
    if (featured === "true") {
      sql += ` AND p.featured = true`;
    }

    sql += ` ORDER BY p.created_at DESC`;

    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product by slug (public)
router.get("/:slug", async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT p.*,
        json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'icon', c.icon, 'sort_order', c.sort_order) as categories,
        COALESCE(
          (SELECT json_agg(json_build_object('id', ps.id, 'url', ps.url, 'sort_order', ps.sort_order) ORDER BY ps.sort_order)
           FROM product_screenshots ps WHERE ps.product_id = p.id), '[]'
        ) as product_screenshots
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.slug = $1`,
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get reviews for a product (public)
router.get("/:productId/reviews", async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT r.*, 
        json_build_object('display_name', p.display_name, 'avatar_url', p.avatar_url) as profiles
      FROM reviews r 
      JOIN profiles p ON p.user_id = r.user_id 
      WHERE r.product_id = $1 
      ORDER BY r.created_at DESC`,
      [req.params.productId]
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
