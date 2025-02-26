import type { NextFunction, Request, Response } from "express";
import admin from "./admin";
import { AppDataSource } from "../../datasource";
import { Users } from "../entity";
import { AuthRequest } from "../types/questRequest";



class UnauthorizedError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}
}
class CustomError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}
}
class UserError extends CustomError {}

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

		const userRepo = await AppDataSource.getRepository(Users).findOneBy({
			email: decodedToken.email
		})
	
		req.user = {
			email: userRepo.email,
			userId: userRepo.user_id
		};

		next();
	} catch (error) {

		if (error instanceof UnauthorizedError) {
			res.status(error.statusCode).send(error.message);
		}
		if (error instanceof UserError) {
			res.status(error.statusCode).send(error.message)
		}

		console.error("Error in Auth Middleware", error)
		res.status(500).send("Internal Error");

	}
}
