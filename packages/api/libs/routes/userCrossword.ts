import express from "express";
import type { NextFunction, Response } from "express";

import type { UserCrossword } from "../entity";
import { CustomError } from "../errors/customError";
import { userCrosswordService } from "../services";
import type { AuthRequest } from "../types/questRequest";

const userCrosswordRouter = express.Router();

userCrosswordRouter.get("/", async (req: AuthRequest,
	res: Response,
	next: NextFunction) => {
	try {
		const userId = req.user.userId
		const crosswords = await userCrosswordService.getAll(userId)
		res.status(200).send(crosswords)
	} catch (e) {
		next(e)
	}
})

userCrosswordRouter.get("/latest", async (req: AuthRequest,
	res: Response,
	next: NextFunction) => {
	try {
		const userId = req.user.userId
		const crosswords = await userCrosswordService.getLatest(userId)
		
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

		const createdProgress = await userCrosswordService.createOrUpdate(crosswordId, timeTaken, userId)

		res.status(201).json(createdProgress)
	} catch (e) {
		next(e)
	}

});


export default userCrosswordRouter;
