const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:12580@localhost:5432/sourcestack?schema=public"
});

const newProducts = [
  { title: "Premium Icon Pack 2000+", slug: "premium-icon-pack", description: "Minimal line icons arranged in a beautiful grid pattern. Clean organized display for all your design needs.", price: 8, category: "Icons & Graphics", thumbnail_url: "/assets/placeholders/product_icon_pack.png" },
  { title: "React Elements UI Components", slug: "react-elements-ui", description: "A comprehensive React UI component library with modern design system, color swatches, and accessible components.", price: 13, category: "UI Kits", thumbnail_url: "/assets/placeholders/product_react_components.png" },
  { title: "Pro Figma Design System", slug: "pro-figma-design-system", description: "Complete Figma design system with UI components, color palettes, typography systems, and card designs.", price: 27, category: "UI Kits", thumbnail_url: "/assets/placeholders/product_figma_design.png" },
  { title: "Foodie Flutter Mobile App", slug: "foodie-flutter-app", description: "Flutter mobile app template for food delivery. Includes restaurant listings, order tracking, and checkout screens.", price: 103, category: "Mobile Apps", thumbnail_url: "/assets/placeholders/product_flutter_app.png" },
  { title: "Corporate WordPress Theme", slug: "corporate-wp-theme", description: "Multipurpose WordPress theme for corporate websites. Includes hero section, team cards, and portfolio grid.", price: 110, category: "UI Kits", thumbnail_url: "/assets/placeholders/product_wordpress_theme.png" },
  { title: "Laravel Advanced API Boilerplate", slug: "laravel-api-boilerplate", description: "REST API boilerplate for Laravel. Includes API endpoint documentation, authentication, and database schema.", price: 129, category: "Backend Code", thumbnail_url: "/assets/placeholders/product_laravel_api.png" },
  { title: "Next.js SaaS Foundation Kit", slug: "nextjs-saas-starter", description: "SaaS starter kit built with Next.js. Features landing page, pricing tables, and authentication screens.", price: 204, category: "Landing Pages", thumbnail_url: "/assets/placeholders/product_nextjs_saas.png" },
  { title: "Luxe E-Commerce Store Theme", slug: "luxe-ecommerce-theme", description: "Premium eCommerce website template with product cards, shopping cart, and beautiful hero banners.", price: 300, category: "Landing Pages", thumbnail_url: "/assets/placeholders/product_ecommerce_theme.png" },
  { title: "CloudNova SaaS Admin Dashboard", slug: "cloudnova-saas-dashboard", description: "Modern dark-mode admin dashboard template with charts, analytics data, sidebar navigation, and data tables.", price: 470, category: "Dashboard Themes", thumbnail_url: "/assets/placeholders/product_saas_dashboard.png" },
  { title: "Neon Crypto Exchange Platform", slug: "neon-crypto-exchange", description: "Complete cryptocurrency exchange platform with candlestick charts, order book, and wallet balance.", price: 499, category: "Dashboard Themes", thumbnail_url: "/assets/placeholders/product_crypto_exchange.png" }
];

async function main() {
  try {
    await client.connect();
    console.log('✅ Connected to Postgres Database');
    
    // Get Admin User ID
    const userRes = await client.query("SELECT id FROM users WHERE email = 'admin@kore.com' LIMIT 1");
    if (userRes.rows.length === 0) throw new Error("Admin user not found");
    const adminId = userRes.rows[0].id;
    
    // Get Category Map
    const catRes = await client.query("SELECT id, name FROM categories");
    const catMap = {};
    for (const row of catRes.rows) catMap[row.name] = row.id;
    
    for (const p of newProducts) {
      const catId = catMap[p.category] || catRes.rows[0].id; // fallback to first category if not found
      
      const res = await client.query(`
        INSERT INTO products (title, slug, description, price, category_id, vendor_id, status, featured, thumbnail_url, version, tags, sales_count)
        VALUES ($1, $2, $3, $4, $5, $6, 'approved', true, $7, '1.0.0', '{"premium", "new"}', floor(random() * 500 + 50))
        ON CONFLICT (slug) DO UPDATE SET price = $4, thumbnail_url = $7, description = $3
        RETURNING id
      `, [p.title, p.slug, p.description, p.price, catId, adminId, p.thumbnail_url]);
      
      console.log("Added product: " + p.title + " - $" + p.price);
    }
    
    console.log('✅ All 10 new products added successfully!');
  } catch (error) {
    console.error('❌ Error adding products:', error);
  } finally {
    await client.end();
  }
}

main();
