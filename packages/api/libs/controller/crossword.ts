import { Request, Response } from "express";
import { crosswordService } from "../services/crossword";
import CrosswordGenerator from "../utils/crossword-generator";


const getCrosswordByFilter = async (req: Request, res: Response) => {
    const cw = await crosswordService();


    const words = cw.map((v) => v.word_text)
    const generator = new CrosswordGenerator();
    const crossword = generator.generateCrossword(words);
    const metaData = [];

    for (let i = 0; i < generator.startPos.length; i++) {
        const element = generator.startPos[i];
        for (const md of cw) {
            console.log({ md, element })
            if (md.word_text === element.word) {
                metaData.push({
                    startPos: { x: element.x, y: element.y },
                    word: md.topic_name,
                    clue: md.clue
                })
            }
        }
    }

    res.send({
        crossword,
        metaData,
        title: cw[0].title
    });

};


export { getCrosswordByFilter };