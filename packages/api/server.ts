import "reflect-metadata";
import express from "express";
import methodOverride from "method-override";
import { AppDataSource } from "./datasource";
import { errorHandler } from "./errorHandle";
import initializeRoutes from "./libs/routes/router";

require("dotenv").config();

AppDataSource.initialize()
	.then(() => {
		const app = express();
		const port = process.env.PORT || 3000;
		app.use(express.json());

		app.use(express.urlencoded({ extended: true }));
		app.use(methodOverride());

		initializeRoutes(app);
		app.use(errorHandler);

		app.listen(port, () => {
			console.log(`Server listening on port https://localhost:${port}`);
		});
	})
	.catch((err) => {
		throw Error(`Error at the core! ${err}`);
	});
