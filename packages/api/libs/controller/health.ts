import type { Request, Response } from "express";
import { AppDataSource } from "../../datasource";
import admin from "../auth/admin";

export const healthCheck = (req: Request, res: Response) => {
	res.status(200).json({ status: "ok" });
};

export const healthServices = (req: Request, res: Response) => {
	try {
		const auth = admin.auth().app.name;
		const database = AppDataSource.isInitialized;

		res.status(200).json({
			status: {
				database,
				auth: auth ? "up" : "down",
			},
		});
	} catch (err) {
		res.status(400);
	}
};
