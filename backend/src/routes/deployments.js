import { Router } from "express";
import {
  createDeployment,
  listDeployments,
  destroyDeployment,
} from "../controllers/deploymentsController.js";

const r = Router();
r.get("/", listDeployments);
r.post("/", createDeployment);
r.delete("/:id", destroyDeployment);

export default r;
