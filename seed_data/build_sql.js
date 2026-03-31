import fs from 'fs';

const products = JSON.parse(fs.readFileSync('seed_data/products.json', 'utf8'));

// Admin user UUID from Supabase migrations
const vendorId = '888b6182-eac0-485a-8d54-e881dec139d2';

let sql = `-- ==========================================\n`;
sql += `-- STEP 1: UPLOAD THE 50 PRODUCTS TO SERVERS \n`;
sql += `-- ==========================================\n`;
sql += `-- Copy and paste this entirely into your Supabase SQL Editor and click "RUN".\n\n`;

sql += `INSERT INTO public.products (id, title, slug, description, price, vendor_id, status, featured, thumbnail_url, version, tags, sales_count) VALUES\n`;

const values = products.map(p => {
  const tagsStr = p.tags.map(t => `'${t}'`).join(',');
  return `('${p.id}', '${p.title.replace(/'/g, "''")}', '${p.slug}', '${p.description.replace(/'/g, "''")}', ${p.price}, '${vendorId}', 'approved', ${p.featured}, '${p.thumbnail}', '${p.version}', ARRAY[${tagsStr}], ${p.salesCount})`;
});

sql += values.join(',\n') + ';\n\n';

sql += `-- ==========================================\n`;
sql += `-- STEP 2: HOW TO GET YOUR ADMIN PASSWORD  \n`;
sql += `-- ==========================================\n`;
sql += `-- Because Supabase heavily encrypts passwords, you cannot extract the default admin password.\n`;
sql += `-- Instead, follow these 3 steps to make YOUR OWN account the Admin:\n`;
sql += `-- 1. Go to your live website and "Sign Up" normally with your own Email and Password.\n`;
sql += `-- 2. Go to your Supabase Dashboard -> Authentication -> Users, and copy the 'User UID' of the account you just made.\n`;
sql += `-- 3. Paste your User UID into the command below and RUN it in the SQL Editor to grant yourself full Admin access:\n\n`;
sql += `-- INSERT INTO public.user_roles (user_id, role) VALUES ('PASTE-YOUR-UID-HERE', 'admin') ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';\n`;


fs.writeFileSync('seed_data/upload_to_supabase.sql', sql);
console.log('Successfully generated upload_to_supabase.sql');
