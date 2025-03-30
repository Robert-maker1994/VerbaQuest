import type { CrosswordResponse, LanguageCode } from "@verbaquest/types";
import type { NextFunction, Response } from "express";
import {
	type CrosswordGrid,
	type CrosswordMetadata,
	generateCrossword,
} from "../../utils/generateCrossword";
import type { Crossword } from "../entity";
import { CrosswordError } from "../errors";
import crosswordService from "../services/crosswordService";
import type { AuthRequest } from "../types/questRequest";
import axios from "axios";

async function crosswordResponse(
	crossword: Crossword,
	metadata: CrosswordMetadata,
	grid: CrosswordGrid,
	targetLanguage: LanguageCode
): Promise<CrosswordResponse> {
	const data = metadata.words_data.map(async (data) => {
		const matchedWord = crossword.crosswordWords.find(
			(word) => word.words.word_text === data.word,
		);

		if (!matchedWord.words) {
			console.info("No matched error generating metadata object")
			throw new CrosswordError("Internal Error", 404)
		}

		const res = await axios.post<{ translatedText: string }>("http://localhost:5000/translate", {

			q: matchedWord.words.word_text,
			source: "auto",
			target: targetLanguage,
			format: "text",
			alternatives: 1,
			api_key: ""
		},
			{ headers: { "Content-Type": "application/json" } }
		)
		if (!res.data.translatedText) {
			throw new CrosswordError("no translation founf", 404)
		}
		return {
			...data,
			word_id: matchedWord.words.word_id,
			word: matchedWord.words.word_text,
			clue: matchedWord.clue,
			definition: res.data.translatedText,
		};
	});
	return {
		title: crossword?.title,
		isComplete: false,
		id: crossword.crossword_id,
		metadata: await Promise.all(data),
		crossword: grid,
	};
}

const getCrosswordById = async (
	req: AuthRequest,
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

		res.send(await crosswordResponse(crossword, metadata, grid, req.user.app_language));
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
