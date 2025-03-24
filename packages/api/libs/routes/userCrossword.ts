import express from "express";
import type { NextFunction, Response } from "express";
import { CustomError } from "../errors/customError";
import { userCrosswordService } from "../services";
import type { AuthRequest } from "../types/questRequest";

const userCrosswordRouter = express.Router();

userCrosswordRouter.get(
	"/",
	async (req: AuthRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req.user.userId;
			const crosswords = await userCrosswordService.getAll(userId);
			res.status(200).send(crosswords);
		} catch (e) {
			next(e);
		}
	},
);

userCrosswordRouter.get(
	"/latest",
	async (req: AuthRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req.user.userId;
			const crosswords = await userCrosswordService.getLatest(userId);

			res.status(200).send(crosswords);
		} catch (e) {
			next(e);
		}
	},
);

userCrosswordRouter.post(
	"/",
	async (req: AuthRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req.user.userId;
			const { crosswordId, timeTaken, completed } = req.body;

			if (Number.isNaN(crosswordId) || Number.isNaN(timeTaken) || typeof completed !== "boolean") {
				console.info("CrosswordID", crosswordId, "time taken", timeTaken);
				throw new CustomError("INVALID_PARAMS", 500);
			}

			const createdProgress = await userCrosswordService.createOrUpdate(
				crosswordId,
				timeTaken,
				userId,
				completed
			);

			res.status(201).json(createdProgress);
		} catch (e) {
			next(e);
		}
	},
);

export default userCrosswordRouter;
