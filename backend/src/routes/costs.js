import { Router } from "express";
import { getCosts } from "../controllers/costsController.js";
const r = Router();
r.get("/", getCosts);
export default r;
