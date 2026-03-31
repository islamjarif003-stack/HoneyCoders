const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:12580@localhost:5432/sourcestack' });

async function seedEps() {
  const settings = [
    { key: 'eps_username', value: 'hunnycoders.com@gmail.com' },
    { key: 'eps_password', value: 'HunnyIT8@' },
    { key: 'eps_merchant_id', value: '89f0ec61-3125-4f61-8e0a-c4ee1f96d619' },
    { key: 'eps_store_id', value: 'ba01fabc-77f4-4eef-835d-3142f6c722fe' },
    { key: 'eps_hash_key', value: 'FMUNISHOY2lWZEPSXTy40C2DHUNNYIT' },
  ];

  for (const s of settings) {
    await pool.query(
      `INSERT INTO payment_settings (setting_key, setting_value)
       VALUES ($1, $2)
       ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value`,
      [s.key, s.value]
    );
  }
  console.log('Hunny IT EPS credentials saved!');
  await pool.end();
}
seedEps();
