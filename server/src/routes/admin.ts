import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { query } from "../db";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.use(requireRole("admin"));

// All products
router.get("/products", async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT p.*, json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as categories
       FROM products p LEFT JOIN categories c ON c.id = p.category_id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Update product status
router.patch("/products/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await query("UPDATE products SET status = $1 WHERE id = $2", [status, req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Full product update
router.put("/products/:id", async (req, res) => {
  try {
    const { title, description, price, category_id, status, featured, thumbnail_url, version, tags } = req.body;
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (title !== undefined) { updates.push(`title = $${idx++}`); values.push(title); }
    if (description !== undefined) { updates.push(`description = $${idx++}`); values.push(description); }
    if (price !== undefined) { updates.push(`price = $${idx++}`); values.push(Number(price)); }
    if (category_id !== undefined) { updates.push(`category_id = $${idx++}`); values.push(category_id || null); }
    if (status !== undefined) { updates.push(`status = $${idx++}`); values.push(status); }
    if (featured !== undefined) { updates.push(`featured = $${idx++}`); values.push(featured); }
    if (thumbnail_url !== undefined) { updates.push(`thumbnail_url = $${idx++}`); values.push(thumbnail_url); }
    if (version !== undefined) { updates.push(`version = $${idx++}`); values.push(version); }
    if (tags !== undefined) { updates.push(`tags = $${idx++}`); values.push(Array.isArray(tags) ? tags : tags.split(",").map((t: string) => t.trim()).filter(Boolean)); }

    if (!updates.length) return res.status(400).json({ message: "No fields to update" });

    values.push(req.params.id);
    await query(`UPDATE products SET ${updates.join(", ")} WHERE id = $${idx}`, values);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// All orders
router.get("/orders", async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT o.*, json_build_object('title', p.title, 'thumbnail_url', p.thumbnail_url) as products
       FROM orders o JOIN products p ON p.id = o.product_id
       ORDER BY o.created_at DESC`
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// All vendors
router.get("/vendors", async (_req, res) => {
  try {
    const { rows: vendorRoles } = await query("SELECT user_id FROM user_roles WHERE role = 'vendor'");
    if (!vendorRoles.length) return res.json([]);

    const ids = vendorRoles.map((r) => r.user_id);
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");

    const { rows: profiles } = await query(`SELECT * FROM profiles WHERE user_id IN (${placeholders})`, ids);
    const { rows: products } = await query(`SELECT vendor_id FROM products WHERE vendor_id IN (${placeholders})`, ids);

    const result = profiles.map((p) => ({
      ...p,
      product_count: products.filter((pr) => pr.vendor_id === p.user_id).length,
    }));
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// All withdrawals
router.get("/withdrawals", async (_req, res) => {
  try {
    const { rows } = await query("SELECT * FROM withdrawals ORDER BY created_at DESC");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Update withdrawal status
router.patch("/withdrawals/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await query("UPDATE withdrawals SET status = $1 WHERE id = $2", [status, req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// All users
router.get("/users", async (_req, res) => {
  try {
    const { rows: profiles } = await query("SELECT * FROM profiles ORDER BY created_at DESC");
    const { rows: roles } = await query("SELECT user_id, role FROM user_roles");

    const result = profiles.map((p) => ({
      ...p,
      roles: roles.filter((r) => r.user_id === p.user_id).map((r) => r.role),
    }));
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// User admin actions
router.post("/users/action", async (req: AuthRequest, res) => {
  try {
    const { action, userId, ...params } = req.body;

    switch (action) {
      case "update_role": {
        const { role, add } = params;
        if (add) {
          await query(
            "INSERT INTO user_roles (user_id, role) VALUES ($1, $2) ON CONFLICT (user_id, role) DO NOTHING",
            [userId, role]
          );
        } else {
          await query("DELETE FROM user_roles WHERE user_id = $1 AND role = $2", [userId, role]);
        }
        break;
      }
      case "update_status": {
        const { status } = params;
        await query("UPDATE profiles SET account_status = $1 WHERE user_id = $2", [status, userId]);
        break;
      }
      case "reset_password": {
        // Generate a temporary password
        const tempPassword = uuidv4().slice(0, 12);
        const hash = await bcrypt.hash(tempPassword, 12);
        await query("UPDATE users SET password_hash = $1 WHERE id = $2", [hash, userId]);
        return res.json({ success: true, message: "Password reset", tempPassword });
      }
      case "delete_user": {
        await query("DELETE FROM users WHERE id = $1", [userId]);
        break;
      }
      default:
        return res.status(400).json({ message: "Unknown action" });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Categories CRUD
router.post("/categories", async (req, res) => {
  try {
    const { name, slug, icon, sort_order } = req.body;
    const { rows } = await query(
      "INSERT INTO categories (name, slug, icon, sort_order) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, slug, icon, sort_order || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/categories/:id", async (req, res) => {
  try {
    const { name, slug, icon, sort_order } = req.body;
    await query(
      "UPDATE categories SET name = $1, slug = $2, icon = $3, sort_order = $4 WHERE id = $5",
      [name, slug, icon, sort_order || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    await query("DELETE FROM categories WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Pages CRUD
router.get("/pages", async (_req, res) => {
  try {
    const { rows } = await query("SELECT * FROM site_pages ORDER BY created_at ASC");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/pages/:id", async (req, res) => {
  try {
    const { title, content, is_published } = req.body;
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (title !== undefined) { updates.push(`title = $${idx++}`); values.push(title); }
    if (content !== undefined) { updates.push(`content = $${idx++}`); values.push(content); }
    if (is_published !== undefined) { updates.push(`is_published = $${idx++}`); values.push(is_published); }

    values.push(req.params.id);
    await query(`UPDATE site_pages SET ${updates.join(", ")} WHERE id = $${idx}`, values);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
