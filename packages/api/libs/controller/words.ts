import type { NextFunction, Request, Response } from "express";
import { createWord, getWords } from "../services/word";

export const getWordsController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const words = await getWords();
		res.status(200).json(words);
	} catch (err) {
		next(err);
	}
};

export const createWordController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const word = await createWord(req.body);
		res.status(201).json(word);
	} catch (err) {
		next(err);
	}
};
