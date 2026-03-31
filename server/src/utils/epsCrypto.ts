import crypto from "crypto";

/**
 * EPS Payment Gateway Hash Generation
 * Step 1: Encode Hash Key using UTF8
 * Step 2: Create HMACSHA512 using encoded data
 * Step 3: Compute Hash using created hmac and the parameter value (e.g., userName or merchantTransactionId)
 * Step 4: Return Base64 string of Hash
 */
export function generateEpsHash(hashKey: string, data: string): string {
  // Step 1: Encode Hash Key using UTF8
  const keyBuffer = Buffer.from(hashKey, "utf8");

  // Step 2 & 3: Create HMACSHA512 and compute hash
  const hmac = crypto.createHmac("sha512", keyBuffer);
  hmac.update(data, "utf8");

  // Step 4: Return Base64 string
  return hmac.digest("base64");
}
