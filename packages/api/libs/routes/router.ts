import type core from "express";
import { authMiddleware } from "../auth/authMiddleware";
import crosswordRouter from "./crossword";
import healthRouter from "./health";
import topicRouter from "./topic";
import userRouter from "./user";
import userCrosswordRouter from "./userCrossword";
import wordRouter from "./word";

export default function initializeRoutes(app: core.Express) {
	app.use("/crossword", crosswordRouter);
	app.use("/health", healthRouter);
	app.use("/user", authMiddleware, userRouter);
	app.use("/usercrossword", authMiddleware, userCrosswordRouter);
	app.use("/topic", topicRouter);
	app.use("/word", wordRouter);
}
