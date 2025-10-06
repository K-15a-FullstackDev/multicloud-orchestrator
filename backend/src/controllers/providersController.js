import pool from "../db/pool.js";
import { z } from "zod";
import { encrypt, decrypt } from "../lib/crypto.js";
import { validateAws, validateAzure } from "../services/cloudValidation.js";

const ProviderSchema = z.object({
  name: z.enum(["aws", "azure"]),
  display_name: z.string().min(2),
  credentials: z.record(z.string(), z.string()),
});

export async function addProvider(req, res) {
  try {
    const parsed = ProviderSchema.parse(req.body);
    const enc = encrypt(JSON.stringify(parsed.credentials));
    const { rows } = await pool.query(
      `INSERT INTO providers (name, display_name, enc_credentials)
       VALUES ($1,$2,$3) RETURNING id`,
      [parsed.name, parsed.display_name, Buffer.from(enc, "base64")]
    );
    return res.status(201).json({ id: rows[0].id });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e.message });
  }
}

export async function listProviders(_req, res) {
  const { rows } = await pool.query(
    "SELECT id, name, display_name, created_at FROM providers"
  );
  res.json(rows);
}

export async function checkProvider(req, res) {
  const { id } = req.params;
  const { rows } = await pool.query("SELECT * FROM providers WHERE id=$1", [
    id,
  ]);
  if (!rows.length) return res.status(404).json({ error: "Not found" });

  const prov = rows[0];
  const creds = JSON.parse(decrypt(prov.enc_credentials.toString("base64")));

  let result;
  if (prov.name === "aws") result = await validateAws(creds);
  else if (prov.name === "azure") result = await validateAzure(creds);

  res.json({
    id: prov.id,
    provider: prov.name,
    valid: result.valid,
    meta: result.meta,
  });
}
