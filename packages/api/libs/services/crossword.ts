import { AppDataSource } from "../../datasource";
import { CrosswordTopics, Topics, Words, CrosswordWords, Crosswords } from "../entity";

async function crosswordService() {
    try {
        const client = AppDataSource;

        const crossword = await client
        .createQueryBuilder(Crosswords,"c").addSelect("c.title", "title")
        .addSelect("w.word_text", "word_text").addSelect("cw.clue","clue")
        .addSelect("t.topic_name", "topic_name")
        .leftJoin(CrosswordTopics, "ct", "c.crossword_id = ct.crossword_id")
        .leftJoin(Topics, "t", "ct.topic_id = t.topic_id")
        .leftJoin(CrosswordWords, "cw", "c.crossword_id = cw.crossword_id")
        .leftJoin(Words, "w", "cw.word_id = w.word_id")
        .where("c.crossword_id = :crosswordId", { crosswordId: 1 });

        return crossword.getRawMany()
    } catch (err){
        throw new Error(`Error in Crossword server ${err}`)
    }

}

export { crosswordService }