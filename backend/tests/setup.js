import pg from "pg";
import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default async () => {
  const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const schemaPath = path
    .resolve(__dirname, "../src/db/schema.sql")
    .replace("tests\\", "");
  const sql = fs.readFileSync(schemaPath, "utf8");
  await pool.query(sql);
  await pool.end();
};
