import type core from "express";
import { authMiddleware } from "../auth/authMiddleware";
import crosswordRouter from "./crossword";
import healthRouter from "./health";
import translationRouter from "./translation";
import userRouter from "./user";
import userCrosswordRouter from "./userCrossword";
import wordleRouter from "./wordleRoute";

export default function initializeRoutes(app: core.Express) {
	app.use("/crossword", crosswordRouter);
	app.use("/wordle", authMiddleware, wordleRouter);
	app.use("/health", healthRouter);
	app.use("/translation", authMiddleware, translationRouter);
	app.use("/user", authMiddleware, userRouter);
	app.use("/usercrossword", authMiddleware, userCrosswordRouter);
}
