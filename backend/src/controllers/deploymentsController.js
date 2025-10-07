import pool from "../db/pool.js";
import { deployAws, destroyAws } from "../services/terraform/awsStack.js";
import { deployAzure, destroyAzure } from "../services/terraform/azureStack.js";

export async function createDeployment(req, res) {
  const { provider } = req.body;
  if (!["aws", "azure"].includes(provider))
    return res.status(400).json({ error: "Invalid provider" });

  const { rows } = await pool.query(
    `INSERT INTO deployments (provider, stack, status)
     VALUES ($1, $2, $3) RETURNING *`,
    [provider, "basic-stack", "planning"]
  );

  const dep = rows[0];
  res.status(202).json({ id: dep.id, message: "Deployment started" });

  (async () => {
    try {
      const logBuffer = [];
      const appendLog = async (chunk) => {
        logBuffer.push(chunk);
        await pool.query("UPDATE deployments SET last_log=$1 WHERE id=$2", [
          chunk,
          dep.id,
        ]);
      };

      if (provider === "aws") await deployAws(appendLog);
      else await deployAzure(appendLog);

      await pool.query(
        "UPDATE deployments SET status=$1, last_log=$2 WHERE id=$3",
        ["applied", logBuffer.join(""), dep.id]
      );
    } catch (err) {
      await pool.query(
        "UPDATE deployments SET status=$1, last_log=$2 WHERE id=$3",
        ["failed", err.message, dep.id]
      );
    }
  })();
}

export async function destroyDeployment(req, res) {
  const { id } = req.params;
  const { rows } = await pool.query("SELECT * FROM deployments WHERE id=$1", [
    id,
  ]);
  if (!rows.length) return res.status(404).json({ error: "Not found" });

  const dep = rows[0];
  res.status(202).json({ id: dep.id, message: "Destroy started" });

  (async () => {
    const appendLog = async (chunk) => {
      await pool.query("UPDATE deployments SET last_log=$1 WHERE id=$2", [
        chunk,
        dep.id,
      ]);
    };

    try {
      if (dep.provider === "aws") await destroyAws(appendLog);
      else await destroyAzure(appendLog);
      await pool.query(
        "UPDATE deployments SET status='destroyed' WHERE id=$1",
        [dep.id]
      );
    } catch (err) {
      await pool.query(
        "UPDATE deployments SET status='failed', last_log=$1 WHERE id=$2",
        [err.message, dep.id]
      );
    }
  })();
}

export async function listDeployments(_req, res) {
  const { rows } = await pool.query(
    "SELECT id, provider, status, created_at FROM deployments ORDER BY id DESC"
  );
  res.json(rows);
}
