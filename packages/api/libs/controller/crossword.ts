import type { NextFunction, Request, Response } from "express";
import { generateCrossword } from "../../utils/generateCrossword";
import { CrosswordError } from "../errors";
import crosswordService from "../services/crosswordService";
import type { AuthRequest } from "../types/questRequest";
import type { CrosswordResponse } from "@verbaquest/shared";

async function getCrosswordDetails(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const crosswordDetails = await crosswordService.getCrosswordDetails();
		res.send(crosswordDetails);
	} catch (err) {
		next(err);
	}
}

async function getRandomCrossword(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const randomCrossword = await crosswordService.getRandomPublicCrossword();

		if (!randomCrossword) {
			throw new CrosswordError("No crosswords found", 404);
		}

		const words = randomCrossword.crosswordWords.map((v) => v.words.word_text);
		const [crossword, metadata] = generateCrossword(words);

		const response: CrosswordResponse = {
			title: randomCrossword?.title,
			id: randomCrossword.crossword_id,
			metadata: metadata.words_data.map((data) => {
				const definition = randomCrossword.crosswordWords.find(
					(word) => word.words.word_text === data.word,
				)?.words;
				return {
					...data,
					word_id: definition.word_id,
					definition: definition.definition,
				};
			}),
			crossword,
		};
		res.send(response);
	} catch (err) {
		next(err);
	}
}

const getCrosswordById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const randomCrossword = await crosswordService.getCrosswordById(
			Number.parseInt(req.params.id),
		);

		if (!randomCrossword) {
			throw new CrosswordError("No crosswords found", 404);
		}

		const words = randomCrossword.crosswordWords.map((v) => v.words.word_text);
		const [crossword, metadata] = generateCrossword(words);

		const response: CrosswordResponse = {
			title: randomCrossword?.title,
			id: randomCrossword.crossword_id,
			metadata: metadata.words_data.map((data) => {
				const definition = randomCrossword.crosswordWords.find(
					(word) => word.words.word_text === data.word,
				)?.words;
				return {
					...data,
					word_id: definition.word_id,
					definition: definition.definition,
				};
			}),
			crossword,
		};
		res.send(response);
	} catch (err) {
		next(err);
	}
};

async function createNewCrossword(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const body = {
			...req.body,
			userId: req.user.userId,
		};

		const crossword = await crosswordService.createCrossword(body);

		res.status(201).send(crossword);
	} catch (err) {
		next(err);
	}
}

async function deleteUserCrossword(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const name = req.query?.name && { name: String(req.query?.name) };
		const id = req.query?.id && { id: String(req.query?.id) };

		const params = {
			...id,
			...name,
		};

		await crosswordService.deleteCrossword(params);

		res.status(200).send("Crossword has been delete");
	} catch (err) {
		next(err);
	}
}

async function updateUserCrossword(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const updatedCrossword = await crosswordService.updateCrosswordService(
			req.body,
			req.user.userId,
		);

		res.status(204).send(updatedCrossword);
	} catch (err) {
		next(err);
	}
}

export {
	createNewCrossword,
	deleteUserCrossword,
	getCrosswordById,
	getCrosswordDetails,
	getRandomCrossword,
	updateUserCrossword,
};
