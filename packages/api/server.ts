import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./datasource";
import initializeRoutes from "./libs/routes/router";
import methodOverride from "method-override"
import { errorHandler } from "./errorHandle";

require("dotenv").config();

AppDataSource.initialize()
	.then(() => {
		const app = express();
		const port = process.env.PORT || 3000;
		app.use(express.json());


		app.use(express.urlencoded({ extended: true }));
		app.use(methodOverride())
		
		initializeRoutes(app);
		app.use(errorHandler)

		app.listen(port, () => {
			console.log(`Server listening on port https://localhost:${port}`);
		});
	})
	.catch((err) => {
		throw Error(`Error at the core! ${err}`);
	});
