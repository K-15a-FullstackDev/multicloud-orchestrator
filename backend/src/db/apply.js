import fs from "fs";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASS || !DB_NAME) {
  console.error("Missing DB envs. Check backend/.env");
  process.exit(1);
}

const sql = fs.readFileSync(path.resolve("src/db/schema.sql"), "utf8");

const pool = new pg.Pool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: String(DB_PASS),
  database: DB_NAME,
});

(async () => {
  try {
    const client = await pool.connect();
    await client.query(sql);
    client.release();
    console.log("Schema applied successfully.");
    process.exit(0);
  } catch (e) {
    console.error("Schema apply failed:", e.message);
    process.exit(2);
  } finally {
    await pool.end();
  }
})();
