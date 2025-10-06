import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import health from "./routes/health.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", health);

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`API ready on http://localhost:${port}`);
});
