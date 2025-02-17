import { Request, Response } from "express";
import { getCrossword } from "../services/crossword";
import CrosswordGenerator from "../libs/crossword";


const getCrosswordByFilter = async (req: Request, res: Response) => {
    const cw = await getCrossword();
    const words = cw.map((v) => v.word_text)
    const generator = new CrosswordGenerator();
    
    res.send({
        crossword: generator.generateCrossword(words),
        metadata: cw
    });

};


export { getCrosswordByFilter };