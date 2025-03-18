import type { NextFunction, Response } from "express";
import config from "../config";
import { UnauthorizedError, UserError } from "../errors";
import userService from "../services/user";
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

			const userRepo = await userService.getUserByEmail(decodedToken.email);
			req.user = {
				email: userRepo.email,
				userId: userRepo.user_id,
			};
		}
		
		if (config.authMode === AuthMode.LOCAL) {
			if (config.authDefaultToken !== token) {
				throw new UnauthorizedError("DEFAULT_TOKEN_NOT_VALID", 401);
			}
			
			const userRepo = await userService.getUserByEmail(
				config.authDefaultEmail,
			);

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
