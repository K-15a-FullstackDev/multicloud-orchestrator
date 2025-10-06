const fs = require("fs");
const path = require("path");
const pg = require("pg");
const dotenv = require("dotenv");

module.exports = async () => {
  // Prefer .env.test when running tests
  if (fs.existsSync(path.resolve(process.cwd(), ".env.test"))) {
    dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
  } else {
    dotenv.config();
  }

  const pool = new pg.Pool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "mco",
    password: process.env.DB_PASS || "mco",
    database: process.env.DB_NAME || "orchestrator",
  });

  const schemaPath = path.resolve(process.cwd(), "src/db/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
  await pool.query(sql);
  await pool.end();
};
