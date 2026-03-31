const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:12580@localhost:5432/sourcestack?schema=public'
});

async function run() {
  await pool.query("UPDATE payment_settings SET hash_key = 'FMUNISHOY2lWZEPSXTy40C2DHUNNYIT', password = 'HunnyIT8@' WHERE environment = 'Live'");
  console.log('Successfully updated the EPS hash key in the database!');
  process.exit(0);
}

run();
