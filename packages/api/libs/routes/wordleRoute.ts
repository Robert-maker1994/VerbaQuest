import express, { type NextFunction, type Response } from "express";
import wordService from "../services/wordService";
import type { AuthRequest } from "../types/questRequest";

const wordleRouter = express.Router();

wordleRouter.get(
	"/",
	async (req: AuthRequest, res: Response, next: NextFunction) => {
		try {
			const { preferred_language } = req.user;
			const word = await wordService.getWordleWord(preferred_language);

			res.status(200).json(word);
		} catch (error) {
			next(error);
		}
	},
);

export default wordleRouter;
