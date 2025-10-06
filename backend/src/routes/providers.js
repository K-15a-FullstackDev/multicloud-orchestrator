import { Router } from "express";
import {
  addProvider,
  listProviders,
  checkProvider,
} from "../controllers/providersController.js";
const r = Router();

r.post("/", addProvider);
r.get("/", listProviders);
r.get("/:id/check", checkProvider);

export default r;
