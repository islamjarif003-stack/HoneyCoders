const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:12580@localhost:5432/sourcestack?schema=public"
});

async function main() {
  try {
    await client.connect();
    
    await client.query(`
      INSERT INTO site_pages (title, slug, content, is_published) 
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT (slug) DO NOTHING;
    `, ['Refund Policy', 'refund-policy', '# Refund Policy\n\nWe offer a 14-day money-back guarantee for all digital products if the item is broken or not as described.\n\nPlease contact support for refund requests.', true]);
    
    console.log('✅ Refund Policy page added successfully!');
  } catch (error) {
    console.error('❌ Error adding page:', error);
  } finally {
    await client.end();
  }
}

main();
