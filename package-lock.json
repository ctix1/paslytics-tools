/**
 * AES-GCM encryption/decryption using the browser's built-in Web Crypto API.
 * Used to encrypt admin payment recipient settings stored in localStorage.
 *
 * Key is derived from a fixed passphrase using PBKDF2.
 * The IV (12 bytes) is prepended to the ciphertext and stored as base64.
 */

const PASSPHRASE = 'PASlytics-Admin-Secure-2025';
const SALT = new TextEncoder().encode('PASlytics-Salt-v1');

async function deriveKey(): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(PASSPHRASE),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: SALT, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(plaintext: string): Promise<string> {
  const key = await deriveKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  // Prepend IV to ciphertext and encode as base64
  const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuffer), iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptData(base64: string): Promise<string> {
  try {
    const combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const key = await deriveKey();
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return new TextDecoder().decode(decrypted);
  } catch {
    return '';
  }
}

/** Mask a value: show first 4 and last 4 chars, replace middle with *** */
export function maskValue(val: string): string {
  if (!val || val.length <= 8) return '••••••••';
  return val.slice(0, 4) + '••••••••' + val.slice(-4);
}
