import type { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../datasource";
import { User } from "../entity";
import { UnauthorizedError, UserError } from "../errors";
import type { AuthRequest } from "../types/questRequest";
import admin from "./admin";

export async function authMiddleware(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	const token = req.headers.authorization?.split("Bearer ")[1];

	if (!token) {
		throw new UnauthorizedError("Not token provided", 401);
	}

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);

		if (!decodedToken.email) {
			throw new UserError("User not found", 500);
		}

		const userRepo = await AppDataSource.getRepository(User).findOneBy({
			email: decodedToken.email,
		});

		req.user = {
			email: userRepo.email,
			userId: userRepo.user_id,
		};

		next();
	} catch (error) {
		next(error);
	}
}
