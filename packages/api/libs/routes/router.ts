import type core from "express";
import crosswordRouter from "./crossword";
import healthRouter from "./health";
import userRouter from "./user";
import userCrosswordRouter from "./userCrossword";
import topicRouter from "./topic";
import wordRouter from "./word";
import { authMiddleware } from "../auth/authMiddleware";

export default function initializeRoutes(app: core.Express) {
    app.use("/crossword", crosswordRouter);
    app.use("/health", healthRouter);
    app.use("/user",authMiddleware, userRouter);
    app.use("/userCrossword", authMiddleware, userCrosswordRouter);
    app.use("/topic", topicRouter);
    app.use("/word", wordRouter);
}