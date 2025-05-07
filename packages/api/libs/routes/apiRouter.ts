import type core from "express";
import { authMiddleware } from "../auth/authMiddleware";
import crosswordRouter from "./crosswordRoute";
import healthRouter from "./healthRoute";
import translationRouter from "./translationRoute";
import userCrosswordRouter from "./userCrosswordRoute";
import userRouter from "./userRoute";
import userVerbRouter from "./userVerbRouter";
import verbRouter from "./verbRoute";
import wordleRouter from "./wordleRoute";

export default function initializeRoutes(app: core.Express) {
  app.use("/crossword", crosswordRouter);
  app.use("/wordle", authMiddleware, wordleRouter);
  app.use("/health", healthRouter);
  app.use("/translation", authMiddleware, translationRouter);
  app.use("/user", authMiddleware, userRouter);
  app.use("/usercrossword", authMiddleware, userCrosswordRouter);
  app.use("/user-verb", authMiddleware, userVerbRouter);

  app.use("/verb", authMiddleware, verbRouter);
}
