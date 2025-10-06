import request from "supertest";
import app from "../src/index.js";
import { encrypt, decrypt } from "../src/lib/crypto.js";
import { endPool } from "../src/db/pool.js";

test("encryption/decryption", () => {
  const sample = JSON.stringify({ key: "value" });
  const enc = encrypt(sample);
  const dec = decrypt(enc);
  expect(dec).toBe(sample);
});

test("GET /api/providers", async () => {
  const res = await request(app).get("/api/providers");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
}, 15000);

afterAll(async () => {
  await endPool();
});
