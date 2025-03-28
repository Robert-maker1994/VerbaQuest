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

userCrosswordRouter.get(
	"/dashboard",
	async (req: AuthRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req.user.userId;
			const crosswords = await Promise.all([
				await userCrosswordService.getLatest(userId),
				await userCrosswordService.getFavorite(userId),
			]);

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
			const { crosswordId, timeTaken, completed, favorite } = req.body;
			console.log(favorite);

			if (
				Number.isNaN(crosswordId) ||
				Number.isNaN(timeTaken) ||
				typeof completed !== "boolean"
			) {
				console.info("CrosswordID", crosswordId, "time taken", timeTaken);
				throw new CustomError("INVALID_PARAMS", 500);
			}
			const createdProgress = await userCrosswordService.createOrUpdate(
				crosswordId,
				timeTaken,
				userId,
				completed,
				favorite,
			);

			res.status(201).json(createdProgress);
		} catch (e) {
			next(e);
		}
	},
);
userCrosswordRouter.post(
	"/update",
	async (req: AuthRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req.user.userId;
			const { crosswordId, favorite } = req.body;
			console.log({ favorite, crosswordId });

			if (Number.isNaN(crosswordId) || typeof favorite !== "boolean") {
				throw new CustomError("INVALID_PARAMS", 500);
			}
			const id = Number(crosswordId);

			const record = await userCrosswordService.getByUserCrosswordId(
				userId,
				id,
			);
			console.log(record);
			if (record) {
				const updatedRecord = await userCrosswordService.update(
					userId,
					id,
					Boolean(favorite),
				);
				res.status(200).json(updatedRecord);
			} else {
				const createdRecord = await userCrosswordService.create(
					userId,
					id,
					Boolean(favorite),
				);
				res.status(201).json(createdRecord);
			}
		} catch (e) {
			next(e);
		}
	},
);

export default userCrosswordRouter;
