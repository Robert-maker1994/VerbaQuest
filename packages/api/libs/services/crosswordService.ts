import type {
	CreateCrosswordBody,
	UpdateCrosswordBody,
} from "@verbaquest/shared";
import { AppDataSource } from "../../datasource";
import {
	Crossword,
	CrosswordWord,
	type Languages,
	Topic,
	UserCrossword,
	Words,
} from "../entity";
import { CrosswordError, TopicError } from "../errors";
import { getLanguage } from "./language";
type crosswordServiceParams = { id?: string; name?: string };

const crosswordService = {

	async getCrosswordDetails(user_id: number, searchTerm?: string) {
		const client = AppDataSource;
		const crosswordQuery = await client
			.createQueryBuilder(Crossword, "c")
			.leftJoinAndSelect("c.topics", "t")
			.leftJoinAndSelect("t.language", "l")
			.leftJoinAndSelect("c.userCrosswords", "uc",
				"uc.user_id = :user_id",
				{ user_id }
			)
			.select([
				"c.title",
				"c.crossword_id",
				"c.is_Public",
				"c.difficulty",
				"t.topic_name",
				"t.topic_id",
				"l.language_code",
				"uc.completed",
				"uc.completion_timer",
				"uc.user_crossword_id"
			])

		if (!user_id) {
			crosswordQuery.where("c.is_Public = :isPublic", { isPublic: true })
		}


		if (searchTerm) {
			crosswordQuery.andWhere(
				`c.title LIKE :searchTerm
						OR t.topic_name LIKE :searchTerm
					`,
				{ searchTerm: `%${searchTerm}%` },
			);
		}

		const crosswordResults = await crosswordQuery.limit(20)
			.getMany();

		if (!crosswordResults.length) {
			return []
		}

		return crosswordResults;
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


	async createCrossword(body: CreateCrosswordBody) {
		const client = AppDataSource;
		const queryRunner = client.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const { title, topic, words, language, userId } = body;

			const topicRepo = queryRunner.manager.getRepository(Topic);
			const crosswordRepo = queryRunner.manager.getRepository(Crossword);
			const userCrosswordRepo =
				queryRunner.manager.getRepository(UserCrossword);
			const wordsRepo = queryRunner.manager.getRepository(Words);
			const crosswordWordsRepo =
				queryRunner.manager.getRepository(CrosswordWord);

			const languageEntity = await getLanguage({
				language_name: language,
			});

			let topicEntity = await topicRepo.findOneBy({ topic_name: topic });

			if (!topicEntity) {
				topicEntity = topicRepo.create({
					topic_name: topic,
					language: languageEntity,
				});
				topicEntity = await topicRepo.save(topicEntity);
			}

			const crosswordEntity = crosswordRepo.create({
				title,
				is_Public: false,
				language: languageEntity,
				difficulty: "a1",
				topics: [topicEntity],
			});
			const savedCrossword = await crosswordRepo.save(crosswordEntity);

			const userCrosswordEntity = userCrosswordRepo.create({
				user: { user_id: userId },
				crossword: savedCrossword,
				grid_state: "",
				completed: false,
			});
			await userCrosswordRepo.save(userCrosswordEntity);

			for (const word of words) {
				let existingWord = await wordsRepo.findOneBy({ word_text: word });
				if (!existingWord) {
					existingWord = wordsRepo.create({
						word_text: word,
						language: languageEntity,
					});
					existingWord = await wordsRepo.save(existingWord);
				}
				const crosswordWordEntity = crosswordWordsRepo.create({
					crossword: savedCrossword,
					words: existingWord,
					clue: "Not implemented",
				});
				await crosswordWordsRepo.save(crosswordWordEntity);
			}
			await queryRunner.commitTransaction();
			return savedCrossword;
		} catch (err) {
			await queryRunner.rollbackTransaction();

			throw err;
		} finally {
			await queryRunner.release();
		}
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
	async updateCrosswordService(body: UpdateCrosswordBody, userId: number) {
		const client = AppDataSource;
		const queryRunner = client.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const crosswordRepo = queryRunner.manager.getRepository(Crossword);
			const topicRepo = queryRunner.manager.getRepository(Topic);
			const wordsRepo = queryRunner.manager.getRepository(Words);
			const crosswordWordsRepo =
				queryRunner.manager.getRepository(CrosswordWord);
			const userCrosswordRepo =
				queryRunner.manager.getRepository(UserCrossword);

			const userCrosswordEntity = await userCrosswordRepo.findOne({
				where: {
					crossword: { crossword_id: Number.parseInt(body.id) },
					user: { user_id: userId },
				},
				relations: ["crossword"],
			});
			if (!userCrosswordEntity) {
				throw new CrosswordError(
					"Crossword not found or does not belong to the user",
					404,
				);
			}

			const crosswordEntity = userCrosswordEntity.crossword;
			if (body.grid_state) {
				userCrosswordEntity.grid_state = body.grid_state;
			}

			if (body.completed) {
				userCrosswordEntity.completed = body.completed;
			}

			if (body?.title) {
				crosswordEntity.title = body.title;
			}
			let language: Languages;
			if (body?.topic) {
				let topicEntity = await topicRepo.findOne({
					where: { topic_id: body.topic_id },
					relations: ["language"],
				});
				language = topicEntity.language;
				if (!topicEntity) {
					throw new TopicError("No topic has been found to update", 200);
				}

				try {
					if (topicEntity.topic_name !== body.topic) {
						topicEntity.topic_name = body.topic;
						topicEntity = await topicRepo.save(topicEntity);
					}
				} catch {
					throw new TopicError("Cannot update title", 200);
				}

				crosswordEntity.topics = [topicEntity];
			}

			if (body.words) {
				await crosswordWordsRepo.delete({ crossword: crosswordEntity });

				for (const word of body.words) {
					let existingWord = await wordsRepo.findOneBy({ word_text: word });
					if (!existingWord) {
						existingWord = wordsRepo.create({
							word_text: word,
							language: language,
						});
						existingWord = await wordsRepo.save(existingWord);
					}
					const crosswordWordEntity = crosswordWordsRepo.create({
						crossword: crosswordEntity,
						words: existingWord,
						clue: "Not implemented",
					});
					await crosswordWordsRepo.save(crosswordWordEntity);
				}
			}

			const updatedCrossword = await crosswordRepo.save(crosswordEntity);

			const crosswordToReturn = await crosswordRepo.findOne({
				where: { crossword_id: updatedCrossword.crossword_id },
				relations: ["crosswordWords", "crosswordWords.words"],
			});
			await queryRunner.commitTransaction();
			return crosswordToReturn;
		} catch (err) {
			await queryRunner.rollbackTransaction();

			throw err;
		} finally {
			await queryRunner.release();
		}
	},
};

export default crosswordService;
