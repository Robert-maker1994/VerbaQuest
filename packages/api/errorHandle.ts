import type { NextFunction, Request, Response } from "express";
import { CustomError } from "./libs/errors/customError";

export const errorHandler = (
	err: CustomError,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	console.error("Error handler received an error", err);

	if (err instanceof CustomError) {
		res.status(err.statusCode).send(err.message);
		return;
	}

	res.status(500).send("Internal server error");
};
