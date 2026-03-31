import { Router } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { query } from "../db";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

const uploadDir = process.env.UPLOAD_DIR || "./uploads";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB

// Get vendor's products
router.get("/products", authenticate, async (req: AuthRequest, res) => {
  try {
    const { rows } = await query(
      `SELECT p.*, json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as categories
       FROM products p LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.vendor_id = $1 ORDER BY p.created_at DESC`,
      [req.userId]
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get vendor's orders
router.get("/orders", authenticate, async (req: AuthRequest, res) => {
  try {
    const { rows: products } = await query("SELECT id FROM products WHERE vendor_id = $1", [req.userId]);
    if (!products.length) return res.json([]);

    const ids = products.map((p) => p.id);
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
    const { rows } = await query(
      `SELECT o.*, json_build_object('title', p.title) as products
       FROM orders o JOIN products p ON p.id = o.product_id
       WHERE o.product_id IN (${placeholders})
       ORDER BY o.created_at DESC`,
      ids
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Upload product
router.post(
  "/products",
  authenticate,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "product_file", maxCount: 1 },
    { name: "screenshots", maxCount: 5 },
  ]),
  async (req: AuthRequest, res) => {
    try {
      const { title, description, price, category_id, version, tags, status } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);

      const thumbnailUrl = files.thumbnail?.[0]
        ? `/uploads/${files.thumbnail[0].filename}`
        : null;

      const fileUrl = files.product_file?.[0]
        ? `/uploads/${files.product_file[0].filename}`
        : null;

      const tagArray = tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [];

      const { rows } = await query(
        `INSERT INTO products (title, slug, description, price, category_id, vendor_id, version, tags, thumbnail_url, file_url, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [title, slug, description || null, Number(price) || 0, category_id || null, req.userId, version || "1.0.0", tagArray, thumbnailUrl, fileUrl, status || "pending"]
      );

      const product = rows[0];

      // Screenshots
      if (files.screenshots) {
        for (let i = 0; i < files.screenshots.length; i++) {
          const ssUrl = `/uploads/${files.screenshots[i].filename}`;
          await query(
            "INSERT INTO product_screenshots (product_id, url, sort_order) VALUES ($1, $2, $3)",
            [product.id, ssUrl, i]
          );
        }
      }

      res.status(201).json(product);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Bulk Upload JSON
router.post("/products/bulk", authenticate, async (req: AuthRequest, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) {
        return res.status(400).json({ message: "Expected array of products" });
    }
    
    let insertedCount = 0;
    const { rows: categories } = await query("SELECT id, name FROM categories");
    const catMap: Record<string, string> = {};
    categories.forEach(c => catMap[c.name] = c.id);
    
    for (const p of products) {
      const slug = p.slug || (p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
      const catId = catMap[p.category] || null;
      
      const { rows } = await query(
        `INSERT INTO products (title, slug, description, price, category_id, vendor_id, status, featured, thumbnail_url, version, tags, sales_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (slug) DO UPDATE SET thumbnail_url = $9, price = $4
         RETURNING id`,
        [p.title, slug, p.description || null, Number(p.price) || 0, catId, req.userId, p.status || "approved", p.featured || false, p.thumbnail || p.thumbnail_url || null, p.version || "1.0.0", p.tags || [], p.salesCount || 0]
      );
      
      const pId = rows[0].id;
      
      // Handle screenshots
      if (p.screenshots && Array.isArray(p.screenshots)) {
        await query("DELETE FROM product_screenshots WHERE product_id = $1", [pId]);
        for (let i = 0; i < p.screenshots.length; i++) {
          await query("INSERT INTO product_screenshots (product_id, url, sort_order) VALUES ($1, $2, $3)", [pId, p.screenshots[i], i]);
        }
      }
      insertedCount++;
    }
    
    res.json({ message: `Successfully bulk uploaded ${insertedCount} products` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
