import express from "express";
import { getCrossword, createNewCrossword } from "../controller/crossword";
import { authMiddleware } from "../auth/authMiddleware";

const crosswordRouter = express.Router();

crosswordRouter.get("/", getCrossword);
crosswordRouter.get("/:id", getCrossword);
crosswordRouter.get("/search", getCrossword);
crosswordRouter.post("/", authMiddleware, createNewCrossword);

export default crosswordRouter;
