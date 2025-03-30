import "reflect-metadata";
import cors from "cors";
import express from "express";
import methodOverride from "method-override";
import { AppDataSource } from "./datasource";
import { errorHandler } from "./errorHandle";
import config from "./libs/config";
import initializeRoutes from "./libs/routes/router";
import csv from "csv-parser";

AppDataSource.initialize()
	.then(() => {
		
		const app = express();
		const port = config.port;
		app.use(cors());

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


