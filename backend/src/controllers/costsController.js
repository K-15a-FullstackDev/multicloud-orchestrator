import pool from "../../db/pool.js";
import { decrypt } from "../../lib/crypto.js";
import { fetchAwsDailyCost } from "../../services/cloudCosts/awsCosts.js";
import { fetchAzureDailyCost } from "../../services/cloudCosts/azureCosts.js";

export async function getCosts(req, res) {
  const { rows } = await pool.query("SELECT * FROM providers");
  const results = [];

  for (const p of rows) {
    const creds = JSON.parse(decrypt(p.enc_credentials.toString("base64")));
    if (p.name === "aws") results.push(await fetchAwsDailyCost(creds));
    if (p.name === "azure") results.push(await fetchAzureDailyCost(creds));
  }

  res.json(results);
}
