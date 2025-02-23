import type { Request, Response } from "express";
import CrosswordGenerator from "../../utils/crossword-generator";
import { crosswordService } from "../services/crossword";

const getCrossword = async (req: Request, res: Response, next) => {
	const cw = await crosswordService(req.query?.name.toString());

	if (!cw.length) {
		res.status(404).send("Sorry, cant find that");
		return;
	}
	const words = cw.map((v) => v.word_text);
	const generator = new CrosswordGenerator();
	const crossword = generator.generateCrossword(words);
	const metaData = [];

	for (let i = 0; i < generator.startPos.length; i++) {
		const element = generator.startPos[i];
		for (const md of cw) {
			if (md.word_text === element.word) {
				metaData.push({
					startPos: { x: element.x, y: element.y },
					word: md.topic_name,
					clue: md.clue,
				});
			}
		}
	}

	res.send({
		crossword,
		metaData,
		title: cw[0].title,
	});
};

export { getCrossword };
