import type { NextFunction, Request, Response } from "express";
import admin from "./admin";
import { AppDataSource } from "../../datasource";
import { User } from "../entity";
import { AuthRequest } from "../types/questRequest";
import { UnauthorizedError, UserError } from "../errors";


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
			throw new UserError("User not found", 500)
		}

		const userRepo = await AppDataSource.getRepository(User).findOneBy({
			email: decodedToken.email
		})

		req.user = {
			email: userRepo.email,
			userId: userRepo.user_id
		};

		next();
	} catch (error) {
		next(error)
	}
}
