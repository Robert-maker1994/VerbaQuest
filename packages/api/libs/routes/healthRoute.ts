import express from "express";
import { healthCheck, healthServices } from "../controller/healthController";

const healthRouter = express.Router();

healthRouter.get("/", healthCheck);

healthRouter.get("/status", healthServices);

export default healthRouter;
