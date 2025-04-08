import { V4 } from 'paseto';
import 'dotenv/config';
let privateKeyPromise ;
const loadPrivateKey = async () => {
  if (!privateKeyPromise) {
    if (!process.env.PASETO_PRIVATE_KEY) throw new Error("Missing PASETO_PRIVATE_KEY in .env");
    privateKeyPromise = V4.generateKey('public');
  }
  return privateKeyPromise;
};
const secretKey = await loadPrivateKey();
const issuer = 'auth-system'
const audience = 'auth-system-users'
const expiresIn = process.env.PASETO_EXPIRY || '2h'
const refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRY || '7d'
export {
  secretKey,
  issuer,
  audience,
  expiresIn,
  refreshExpiresIn
};
