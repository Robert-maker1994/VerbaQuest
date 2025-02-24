import { AppDataSource } from "../../datasource";
import {
    Crosswords
} from "../entity";

type crosswordServiceParams = { id?: string; name?: string }

export class ServiceError extends Error { }

async function crosswordService(q?: crosswordServiceParams) {
    try {
        const client = AppDataSource;

        const crossword = await client
            .createQueryBuilder(Crosswords, "c")
            .leftJoinAndSelect("c.crosswordTopics", "ct")
            .leftJoinAndSelect("ct.topics", "t")
            .leftJoinAndSelect("c.crosswordWords", "cw")
            .leftJoinAndSelect("cw.word", "w")
            .select(["c.title",
                "w.word_text",
                "cw.clue",
                "t.topic_name"
            ]);

            if (q?.name) {
                const query = q?.name;
            crossword.where("unaccent(Lower(t.topic_name)) ILike :name", {
                name: `%${query?.toLowerCase()}%`
            });
        }
        if (q?.id) {
            const id = q?.id;
            crossword.where("c.crossword_id = :id", { id });
        }

        return await crossword.getMany();
    } catch (err) {
        throw new ServiceError(`Error in Crossword server ${err}`);
    }
}

export { crosswordService };
