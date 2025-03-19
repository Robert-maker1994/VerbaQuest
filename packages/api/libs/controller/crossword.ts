import type { GetCrosswordResponse } from "@verbaquest/shared";
import type { NextFunction, Request, Response } from "express";
import { type CrosswordGrid, type CrosswordMetadata, generateCrossword } from "../../utils/generateCrossword";
import type { Crossword } from "../entity";
import { CrosswordError } from "../errors";
import crosswordService from "../services/crosswordService";
import type { AuthRequest } from "../types/questRequest";

function crosswordResponse(crossword: Crossword, metadata: CrosswordMetadata, grid: CrosswordGrid): GetCrosswordResponse {
	return {

		title: crossword?.title,
		isCompleted: false,
		id: crossword.crossword_id,
		metadata: metadata.words_data.map((data) => {
			const definition = crossword.crosswordWords.find(
				(word) => word.words.word_text === data.word,
			)?.words;
			return {
				...data,
				word_id: definition.word_id,
				definition: definition.definition,
			};
		}),
		crossword: grid,
	}
}


const getCrosswordById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const crossword = await crosswordService.getCrosswordById(
			Number.parseInt(req.params.id),
		);

		if (!crossword) {
			throw new CrosswordError("No crosswords found", 404);
		}

		const words = crossword.crosswordWords.map((v) => v.words.word_text);
		const [grid, metadata] = generateCrossword(words);

		res.send(crosswordResponse(crossword, metadata, grid));
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
	updateUserCrossword,
};
