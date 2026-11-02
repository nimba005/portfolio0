// Prints an ADMIN_PASSWORD_HASH value for Cloudflare. Usage: npm run hash-password -- "your password"
import { hashPassword } from '../analytics/crypto.js';

const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run hash-password -- "your password"');
  process.exit(1);
}

console.log(await hashPassword(password));
