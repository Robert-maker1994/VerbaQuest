import type { NextFunction, Request, Response } from "express";
import CrosswordGenerator from "../../utils/crossword-generator";
import { CrosswordError } from "../errors";
import {
	createCrossword,
	deleteCrossword,
	getCrosswordDetails as getCrosswordDetailsService,
	getCrosswordToGen,
	updateCrosswordService,
} from "../services/crossword";
import type { AuthRequest } from "../types/questRequest";

interface Metadata {
	startPos: { x: number; y: number };
	word: string;
	clue: string;
}
interface CrosswordResponse {
	crossword: string[][];
	title: string;
	metadata: Metadata[];
}

async function getCrosswordDetails(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const crosswordDetails = await getCrosswordDetailsService();
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
		const crosswords = await getCrosswordToGen();
		if (!crosswords.length) {
			throw new CrosswordError("No crosswords found", 404);
		}
		const randomIndex = Math.floor(Math.random() * crosswords.length);
		const randomCrossword = crosswords[randomIndex];
		const words = randomCrossword.crosswordWords.map((v) => v.words.word_text);
		const generator = new CrosswordGenerator();
		const metadata = [];

		const crossword = generator.generateCrossword(words);

		for (let i = 0; i < generator.startPos.length; i++) {
			const element = generator.startPos[i];
			for (const md of randomCrossword.crosswordWords) {
				if (md.words.word_text === element.word) {
					metadata.push({
						startPos: { x: element.x, y: element.y },
						word: md.words.word_text,
						clue: md.clue,
					});
				}
			}
		}
		const response: CrosswordResponse = {
			metadata,
			crossword,
			title: randomCrossword?.title,
		};
		res.send(response);
	} catch (err) {
		next(err);
	}
}

const getCrossword = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	req.query;
	try {
		const name = req.query?.name && { name: String(req.query?.name) };
		const id = req.query?.id && { id: String(req.query?.id) };

		const params = {
			...id,
			...name,
		};
		const cw = await getCrosswordToGen(params);

		if (!cw.length) {
			throw new CrosswordError("Crossword not found", 200);
		}

		const response: CrosswordResponse[] = [];

		for (const crosswordData of cw) {
			const words = crosswordData.crosswordWords.map((v) => v.words.word_text);
			const generator = new CrosswordGenerator();
			const metadata = [];

			const crossword = generator.generateCrossword(words);

			for (let i = 0; i < generator.startPos.length; i++) {
				const element = generator.startPos[i];
				for (const md of crosswordData.crosswordWords) {
					if (md.words.word_text === element.word) {
						metadata.push({
							startPos: { x: element.x, y: element.y },
							word: md.words.word_text,
							clue: md.clue,
						});
					}
				}
			}
			response.push({
				metadata,
				crossword,
				title: crosswordData?.title,
			});
		}

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

		const crossword = await createCrossword(body);

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

		await deleteCrossword(params);

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
		const updatedCrossword = await updateCrosswordService(
			req.body,
			req.user.userId,
		);

		res.status(204).send(updatedCrossword);
	} catch (err) {
		next(err);
	}
}

export {
	getCrossword,
	createNewCrossword,
	deleteUserCrossword,
	getCrosswordDetails,
	getRandomCrossword,
	updateUserCrossword,
};
