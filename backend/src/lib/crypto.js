import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const keyB64 =
  process.env.ENCRYPTION_KEY_BASE64 || Buffer.alloc(32).toString("base64");
const key = Buffer.from(keyB64, "base64");
if (key.length !== 32) {
  throw new Error(
    "ENCRYPTION_KEY_BASE64 must decode to 32 bytes for AES-256-GCM"
  );
}

export function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  // Pack: iv(12) | tag(16) | data
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(encBase64) {
  const raw = Buffer.from(encBase64, "base64");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const data = raw.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString("utf8");
}
