import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import health from "./routes/health.js";
import providers from "./routes/providers.js";
import deployments from "./routes/deployments.js";
import costs from "./routes/costs.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", health);
app.use("/api/providers", providers);
app.use("/api/deployments", deployments);

app.use("/api/costs", costs);
const port = Number(process.env.PORT || 3001);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`API ready on http://localhost:${port}`));
}

export default app;
