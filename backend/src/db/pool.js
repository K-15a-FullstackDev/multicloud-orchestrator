import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASS", "DB_NAME"];
for (const k of required) {
  if (
    process.env[k] === undefined ||
    process.env[k] === null ||
    String(process.env[k]).trim() === ""
  ) {
    throw new Error(`ENV ${k} is missing/empty. Check backend/.env`);
  }
}

const pool = new pg.Pool({
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  user: String(process.env.DB_USER),
  password: String(process.env.DB_PASS),
  database: String(process.env.DB_NAME),
});

export default pool;
