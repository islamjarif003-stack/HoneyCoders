const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:12580@localhost:5432/sourcestack'
});

async function resetPassword() {
  const hash = await bcrypt.hash('admin123', 12);
  await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, 'admin@kore.com']);
  console.log('Admin password reset to: admin123');
  console.log('Hash:', hash);
  await pool.end();
}

resetPassword();
