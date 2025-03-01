import "reflect-metadata";
import express from "express";
import cors from "cors";
import methodOverride from "method-override";
import { AppDataSource } from "./datasource";
import { errorHandler } from "./errorHandle";
import { loadConfig } from "./libs/config/config";
import initializeRoutes from "./libs/routes/router";

const config = loadConfig()

AppDataSource.initialize()
	.then(() => {
		const app = express();
		const port = config.port;
		app.use(express.json());
		app.use(cors());

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
