import type core from "express";
import crosswordRouter from "./crossword";
import crosswordTopicRouter from "./crosswordTopic";
import healthRouter from "./health";

export default function initializeRoutes(app: core.Express) {
	app.use("/crossword", crosswordRouter);
	app.use("/crosswordTopic", crosswordTopicRouter);
	app.use("/health", healthRouter);
}
