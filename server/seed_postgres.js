const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:12580@localhost:5432/sourcestack?schema=public"
});

async function main() {
  try {
    await client.connect();
    console.log('✅ Connected to Custom Postgres Database');
    
    // 1. Create Admin
    const adminEmail = 'admin@kore.com';
    const rawPass = 'admin123';
    const hash = await bcrypt.hash(rawPass, 10);
    
    let res = await client.query('INSERT INTO users (email, password_hash, email_verified) VALUES ($1, $2, true) ON CONFLICT (email) DO UPDATE SET password_hash = $2 RETURNING id', [adminEmail, hash]);
    const adminId = res.rows[0].id;
    await client.query("INSERT INTO user_roles (user_id, role) VALUES ($1, 'admin') ON CONFLICT DO NOTHING", [adminId]);
    await client.query("INSERT INTO profiles (user_id, display_name) VALUES ($1, 'Super Admin') ON CONFLICT DO NOTHING", [adminId]);
    
    // 2. Categories with icons
    const catDefs = [
      { name: "UI Kits", icon: "Palette", sort: 1 },
      { name: "Landing Pages", icon: "LayoutDashboard", sort: 2 },
      { name: "Mobile Apps", icon: "Smartphone", sort: 3 },
      { name: "Dashboard Themes", icon: "Monitor", sort: 4 },
      { name: "Icons & Graphics", icon: "Image", sort: 5 },
      { name: "Backend Code", icon: "Server", sort: 6 },
    ];
    const catMap = {};
    for(let c of catDefs) {
      const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let cRes = await client.query('INSERT INTO categories (name, slug, icon, sort_order) VALUES ($1, $2, $3, $4) ON CONFLICT (slug) DO UPDATE SET name = $1, icon = $3, sort_order = $4 RETURNING id', [c.name, slug, c.icon, c.sort]);
      catMap[c.name] = cRes.rows[0].id;
    }
    
    // 3. Products
    const path = require('path');
    let productsPath = path.join(__dirname, '../seed_data/products.json');
    if (!fs.existsSync(productsPath)) productsPath = path.join(__dirname, 'seed_data/products.json');
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    for(let p of products) {
      let pRes = await client.query(`
        INSERT INTO products (title, slug, description, price, category_id, vendor_id, status, featured, thumbnail_url, version, tags, sales_count)
        VALUES ($1, $2, $3, $4, $5, $6, 'approved', $7, $8, $9, $10, $11)
        ON CONFLICT (slug) DO UPDATE SET thumbnail_url = $8, price = $4, description = $3
        RETURNING id
      `, [p.title, p.slug, p.description, p.price, catMap[p.category], adminId, p.featured, p.thumbnail, p.version, p.tags, p.salesCount]);
      
      const pId = pRes.rows[0].id;
      await client.query('DELETE FROM product_screenshots WHERE product_id = $1', [pId]);
      for(let img of p.screenshots) {
        await client.query('INSERT INTO product_screenshots (product_id, url) VALUES ($1, $2)', [pId, img]);
      }
    }
    
    console.log('✅ Server database completely seeded!');
    console.log('👉 ADMIN EMAIL: ' + adminEmail);
    console.log('👉 ADMIN PASS: ' + rawPass);
  } catch (e) {
    console.error('❌ Database error:', e);
  } finally {
    await client.end();
  }
}
main();
