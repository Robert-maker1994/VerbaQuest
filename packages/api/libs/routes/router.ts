import type core from "express";
import { authMiddleware } from "../auth/authMiddleware";
import crosswordRouter from "./crossword";
import healthRouter from "./health";
import userRouter from "./user";
import userCrosswordRouter from "./userCrossword";
import translationRouter from "./translation";

export default function initializeRoutes(app: core.Express) {
	app.use("/crossword", crosswordRouter);
	app.use("/health", healthRouter);
	app.use("/translation", authMiddleware, translationRouter);
	app.use("/user", authMiddleware, userRouter);
	app.use("/usercrossword", authMiddleware, userCrosswordRouter);

}
