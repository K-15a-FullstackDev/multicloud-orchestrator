import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const raw = (process.env.ENCRYPTION_KEY_BASE64 || "").trim();
const key = Buffer.from(raw, "base64");

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
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(encBase64) {
  const rawBuf = Buffer.from(encBase64, "base64");
  const iv = rawBuf.subarray(0, 12);
  const tag = rawBuf.subarray(12, 28);
  const data = rawBuf.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString("utf8");
}
