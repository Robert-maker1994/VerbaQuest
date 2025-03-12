import type { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../datasource";
import config from "../config";
import { User } from "../entity";
import { UnauthorizedError, UserError } from "../errors";
import type { AuthRequest } from "../types/questRequest";
import admin from "./admin";

export enum AuthMode {
	FIREBASE = "FIREBASE",
	LOCAL = "LOCAL",
}

export async function authMiddleware(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const token = req.headers.authorization?.split("Bearer ")[1];
		if (!token) {
			throw new UnauthorizedError("Not token provided", 401);
		}
		if (config.authMode === AuthMode.FIREBASE) {
			const decodedToken = await admin.auth().verifyIdToken(token);

			if (!decodedToken.email) {
				throw new UserError("USER_NOT_FOUND", 500);
			}

			const userRepo = await AppDataSource.getRepository(User).findOneBy({
				email: decodedToken.email,
			});

			if (!userRepo) {
				throw new UserError("USER_NOT_FOUND", 500);
			}

			req.user = {
				email: userRepo.email,
				userId: userRepo.user_id,
			};
		}

		if (config.authMode === AuthMode.LOCAL) {
			if (config.authDefaultToken !== token) {
				throw new UnauthorizedError("DEFAULT_TOKEN_NOT_VALID", 401);
			}

			const userRepo = await AppDataSource.getRepository(User).findOneBy({
				email: config.authDefaultEmail,
			});

			if (!userRepo) {
				throw new UserError("USER_NOT_FOUND", 500);
			}

			req.user = {
				email: userRepo.email,
				userId: userRepo.user_id,
			};
		}
		next();
	} catch (error) {
		next(error);
	}
}
