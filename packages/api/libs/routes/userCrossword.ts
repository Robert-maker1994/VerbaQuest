import express from "express";
import type { Response, NextFunction } from "express";

import type { AuthRequest } from "../types/questRequest";
import { userCrosswordService } from "../services";
import { CustomError } from "../errors/customError";

const userCrosswordRouter = express.Router();

userCrosswordRouter.get("/", async (req: AuthRequest,
	res: Response,
	next: NextFunction) => {
		try {
			const userId = req.user.userId
			const crosswords = await userCrosswordService.getUserCrosswords(userId)

			res.status(200).json(crosswords)
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


		if(Number.isNaN(crosswordId) || Number.isNaN(timeTaken)){
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
