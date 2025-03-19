import express from "express";
import type { Response, NextFunction } from "express";

import type { AuthRequest } from "../types/questRequest";
import { userCrosswordService } from "../services";
import { CustomError } from "../errors/customError";
import type { UserCrossword } from "../entity";

const userCrosswordRouter = express.Router();

export function groupBy<T, K extends keyof T>(
	array: UserCrossword[]
): Record<string | number | symbol, T[]> {
	return array.reduce((acc, item) => {
		const groupKey = item.crossword.crossword_id;
		if (!acc[groupKey as string | number | symbol]) {
			acc[groupKey as string | number | symbol] = [];
		}
		acc[groupKey as string | number | symbol].push(item);
		return acc;
	}, {} as Record<T[K] extends string | number | symbol ? T[K] : never, T[]>);
}


userCrosswordRouter.get("/", async (req: AuthRequest,
	res: Response,
	next: NextFunction) => {
	try {
		const userId = req.user.userId
		const crosswords = await userCrosswordService.getUserCrosswords(userId)
		res.status(200).send(crosswords)
	} catch (e) {
		next(e)
	}
})

userCrosswordRouter.post("/", async (req: AuthRequest,
	res: Response,
	next: NextFunction) => {
	try {

		const userId = req.user.userId;
		const { crosswordId, timeTaken } = req.body;


		if (Number.isNaN(crosswordId) || Number.isNaN(timeTaken)) {
			console.log(crosswordId, timeTaken)
			throw new CustomError("INVALID_PARAMS", 500)
		}

		const createdProgress = await userCrosswordService.createUserCrossword(crosswordId, timeTaken, userId)

		res.status(201).json(createdProgress)
	} catch (e) {
		next(e)
	}

});


export default userCrosswordRouter;
