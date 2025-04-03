import type core from "express";
import { authMiddleware } from "../auth/authMiddleware";
import crosswordRouter from "./crosswordRoute";
import healthRouter from "./healthRoute";
import translationRouter from "./translationRoute";
import userRouter from "./userRoute";
import userCrosswordRouter from "./userCrosswordRoute";
import wordleRouter from "./wordleRoute";
import verbRouter from "./verbRoute";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

export default function initializeRoutes(app: core.Express) {
	app.use("/crossword", crosswordRouter);
	app.use("/wordle", authMiddleware, wordleRouter);
	app.use("/health", healthRouter);
	app.use("/translation", authMiddleware, translationRouter);
	app.use("/user", authMiddleware, userRouter);
	app.use("/usercrossword", authMiddleware, userCrosswordRouter);
	app.use("/verb", authMiddleware, verbRouter);
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

}

const swaggerSpec = swaggerJSDoc({
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Verbaquest API",
			version: "1.0.0",
			description: "API documentation for the Verbaquest application",
		},
	},
	apis: [ "./libs/controller/*.ts", "./libs/routes/*.ts"],
});
