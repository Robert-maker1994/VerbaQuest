import type { NextFunction, Request, Response } from "express";
import { createUser, deleteUser, getUser, updateUser } from "../services";
import type { AuthRequest } from "../types/questRequest";

export const createUserController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await createUser(req.body);
		res.status(201).json(user);
	} catch (err) {
		next(err);
	}
};

export const getUserController = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await getUser(req.user.userId);
		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};

export const updateUserController = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await updateUser(req.user.userId, req.body);
		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};

export const deleteUserController = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		await deleteUser(req.user.userId);
		res.status(204).send();
	} catch (err) {
		next(err);
	}
};
