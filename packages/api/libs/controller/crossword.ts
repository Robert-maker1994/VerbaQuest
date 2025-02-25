import type { Request, Response } from "express";
import CrosswordGenerator from "../../utils/crossword-generator";
import { crosswordService } from "../services/crossword";

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

const getCrossword = async (req: Request, res: Response) => {
	req.query;
	const name = req.query?.name && { name: String(req.query?.name) };
	const id = req.query?.id && { id: String(req.query?.id) };

	const params = {
		...id,
		...name,
	};
	const cw = await crosswordService(params);
	console.log(cw);
	if (!cw.length) {
		res.status(200).send("Sorry, cant find that");
		return;
	}

	const response: CrosswordResponse[] = [];

	for (const crosswordData of cw) {
		const words = crosswordData.crosswordWords.map((v) => v.word.word_text);
		const generator = new CrosswordGenerator();
		const metadata = [];

		const crossword = generator.generateCrossword(words);

		for (let i = 0; i < generator.startPos.length; i++) {
			const element = generator.startPos[i];
			for (const md of crosswordData.crosswordWords) {
				if (md.word.word_text === element.word) {
					metadata.push({
						startPos: { x: element.x, y: element.y },
						word: md.word.word_text,
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
};

export { getCrossword };
