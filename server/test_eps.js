const crypto = require('crypto');

const userName = 'hunnycoders.com@gmail.com';
const password = 'HunnyIT8@';

function makeHash(key, data) {
  const hmac = crypto.createHmac('sha512', Buffer.from(key, 'utf8'));
  hmac.update(data, 'utf8');
  return hmac.digest('base64');
}

// Based on the zoomed-in screenshot, testing the exact letter variations:
// Notice the letter after "2" - could be lowercase L (l) or uppercase i (I).
// Notice the letter after "T" - could be lowercase y or uppercase Y.
// Notice the letter before "S" - could be lowercase L (l) or uppercase i (I).

const newKeysToTest = [
  'FMUNISHOY2lWZEPSXTy40C2DHUNNYIT', // lowercase L after 2
  'FMUNlSHOY2IWZEPSXTy40C2DHUNNYIT', // lowercase L after N
  'FMUNlSHOY2lWZEPSXTy40C2DHUNNYIT', // lowercase L in both places
  'FMUNISHOY2IWZEPSXTy40C2DHUNNYIT', // Both uppercase I
  // What if the 0 is an O?
  'FMUNISHOY2lWZEPSXTy4OC2DHUNNYIT',
  // Try all combinations of:
  // Post-N: I or l
  // Post-2: I or l
  // Post-T: y or Y
  // Post-4: 0 or O
];

// Generate all permutations mathematically
const N_char = ['I', 'l'];
const two_char = ['I', 'l'];
const T_char = ['y', 'Y'];
const four_char = ['0', 'O'];
const NY_char = ['I', 'l'];

const allKeys = [];
for (const c1 of N_char) {
  for (const c2 of two_char) {
    for (const c3 of T_char) {
      for (const c4 of four_char) {
        for (const c5 of NY_char) {
          allKeys.push(`FMUN${c1}SHOY2${c2}WZEPSXT${c3}4${c4}C2DHUNNY${c5}T`);
        }
      }
    }
  }
}

async function testKey(key) {
  const xHash = makeHash(key, userName);
  try {
    const r = await fetch('https://pgapi.eps.com.bd/v1/Auth/GetToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-hash': xHash },
      body: JSON.stringify({ userName, password }),
    });
    const d = await r.json();
    if (d.token) {
      console.log(`\n✅ SUCCESS! Found the exact key: ${key}`);
      return true;
    }
  } catch(e) {
    // Ignore errors
  }
  return false;
}

(async () => {
  console.log(`Testing ${allKeys.length} possible combinations from the image...`);
  let found = false;
  
  // We process in small batches to not overwhelm the API
  const batchSize = 5;
  for (let i = 0; i < allKeys.length; i += batchSize) {
    const batch = allKeys.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(k => testKey(k)));
    if (results.includes(true)) {
      found = true;
      break;
    }
    process.stdout.write('.');
  }
  
  if (!found) {
    console.log('\n❌ No combination worked. The key is still returning invalid hash.');
  }
})();
