import express from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { createWordController, getWordsController } from "../controller";

const wordRouter = express.Router();

wordRouter.get("/", getWordsController);
wordRouter.post("/", authMiddleware, createWordController);

export default wordRouter;
