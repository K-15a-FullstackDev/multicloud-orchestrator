process.env.NODE_ENV = "test";

if (!process.env.ENCRYPTION_KEY_BASE64) {
  process.env.ENCRYPTION_KEY_BASE64 = Buffer.alloc(32).toString("base64");
}
