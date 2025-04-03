import type { CreateCrosswordBody, CrosswordDetails, LanguageCode } from "@verbaquest/types";
import { AppDataSource } from "../../datasource";
import { Crossword } from "../entity";
import { CrosswordError } from "../errors";
type crosswordServiceParams = { id?: string; name?: string };

const crosswordService = {
  async getCrosswordDetails(
    user_id: number,
    language_code: LanguageCode,
    searchTerm?: string,
    page = 1,
  ): Promise<[CrosswordDetails[], number]> {
    const pageSize = 9;
    const offset = (page - 1) * pageSize;
    const client = AppDataSource;

    if (Number.isNaN(offset) || Number.isNaN(user_id)) {
      console.info("Invalid params", {
        offset,
        user_id,
      });
      throw new CrosswordError("INVALID_PARAMS", 404);
    }

    const queryBuilder = await client
      .createQueryBuilder(Crossword, "c")
      .leftJoinAndSelect("c.topics", "t")
      .leftJoinAndSelect("t.language", "l")
      .leftJoinAndSelect("c.userCrosswords", "uc", "uc.user_id = :user_id", {
        user_id,
      })
      .select([
        "c.title",
        "c.crossword_id",
        "c.is_Public",
        "c.difficulty",
        "t.topic_name",
        "t.topic_id",
        "l.language_code",
        "uc.completed",
        "uc.is_favorite",
        "uc.completion_timer",
        "uc.user_crossword_id",
      ])
      .where("l.language_code = :languageCode", {
        languageCode: language_code,
      });

    if (!user_id) {
      queryBuilder.andWhere("c.is_Public = :isPublic", { isPublic: true });
    }

    if (searchTerm) {
      queryBuilder.andWhere("c.title ILIKE :searchTerm OR t.topic_name ILIKE :searchTerm", {
        searchTerm: `%${searchTerm}%`,
      });
    }

    const [crosswordResults, count] = await queryBuilder
      .orderBy("c.difficulty", "ASC")
      .skip(offset)
      .take(pageSize)
      .getManyAndCount();

    if (!crosswordResults.length) {
      return [[], 0];
    }

    return [crosswordResults, count];
  },

  async getCrosswordById(id: number) {
    const client = AppDataSource;
    const cross = await client
      .createQueryBuilder(Crossword, "c")
      .leftJoinAndSelect("c.crosswordWords", "cw")
      .leftJoinAndSelect("cw.words", "w")
      .leftJoinAndSelect("c.topics", "t")
      .where("c.crossword_id = :id", { id })
      .select([
        "c.title",
        "w.word_text",
        "cw.clue",
        "w.definition",
        "t.topic_name",
        "c.crossword_id",
        "w.word_id",
        "t.topic_id",
      ])
      .getOne();

    if (!cross) {
      throw new CrosswordError("Crossword not found", 404);
    }
    return cross;
  },

  async deleteCrossword(params: crosswordServiceParams) {
    const crosswordQuery = AppDataSource.createQueryBuilder(Crossword, "c");

    const crossword = crosswordQuery
      .leftJoinAndSelect("c.crosswordWords", "cw")
      .leftJoinAndSelect("cw.words", "w")
      .leftJoinAndSelect("c.topics", "t");

    if (params?.name) {
      const query = params?.name;
      crossword.where("unaccent(Lower(t.topic_name)) ILike :name", {
        name: `%${query?.toLowerCase()}%`,
      });
    }
    if (params?.id) {
      const id = params?.id;
      crossword.where("c.crossword_id = :id", { id });
    }

    const crosswordToDelete = await crossword.getOne();

    if (!crosswordToDelete) {
      throw new CrosswordError("Crossword not found", 404);
    }

    if (crosswordToDelete.is_Public) {
      throw new CrosswordError("Cannot delete a public crossword", 401);
    }

    await AppDataSource.getRepository(Crossword).remove(crosswordToDelete);
  },
};

export default crosswordService;
