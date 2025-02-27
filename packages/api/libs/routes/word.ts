import express from "express";
import { getWordsController, createWordController } from "../controller";
import { authMiddleware } from "../auth/authMiddleware";

const wordRouter = express.Router();

wordRouter.get("/", getWordsController);
wordRouter.post("/", authMiddleware, createWordController);

export default wordRouter;