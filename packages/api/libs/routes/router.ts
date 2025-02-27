import type core from "express";
import crosswordRouter from "./crossword";
import healthRouter from "./health";

export default function initializeRoutes(app: core.Express) {
	app.use("/crossword", crosswordRouter);
	app.use("/health", healthRouter);
}
