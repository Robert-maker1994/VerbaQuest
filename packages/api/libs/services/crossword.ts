import { AppDataSource } from "../../datasource";
import {
	Crossword,
	CrosswordWord,
	type LanguageName,
	type Languages,
	Topic,
	UserCrossword,
	Words,
} from "../entity";
import { CrosswordError, LanguageError, TopicError } from "../errors";
import { getLanguage } from "./language";

type crosswordServiceParams = { id?: string; name?: string };

async function crosswordService(q?: crosswordServiceParams) {
	const client = AppDataSource;

	const crosswordQuery = client
		.createQueryBuilder(Crossword, "c")
		.leftJoinAndSelect("c.crosswordWords", "cw")
		.leftJoinAndSelect("cw.words", "w")
		.leftJoinAndSelect("c.topics", "t")
		.select([
			"c.title",
			"w.word_text",
			"cw.clue",
			"t.topic_name",
			"c.crossword_id",
			"w.word_id",
			"t.topic_id",
		]);

	if (q?.name) {
		const query = q?.name;
		crosswordQuery.where("unaccent(Lower(t.topic_name)) ILike :name", {
			name: `%${query?.toLowerCase()}%`,
		});
	}
	if (q?.id) {
		const id = q?.id;
		crosswordQuery.where("c.crossword_id = :id", { id });
	}

	return await crosswordQuery.getMany();
}

interface CreateCrosswordBody {
	title: string;
	topic: string;
	words: string[];
	language: LanguageName;
	userId: number;
}

async function createCrossword(body: CreateCrosswordBody) {
	const client = AppDataSource;
	const queryRunner = client.createQueryRunner();

	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {
		const { title, topic, words, language, userId } = body;

		const topicRepo = queryRunner.manager.getRepository(Topic);
		const crosswordRepo = queryRunner.manager.getRepository(Crossword);
		const userCrosswordRepo = queryRunner.manager.getRepository(UserCrossword);
		const wordsRepo = queryRunner.manager.getRepository(Words);
		const crosswordWordsRepo = queryRunner.manager.getRepository(CrosswordWord);

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
			difficulty: 1,
			topics: [topicEntity],
		});
		const savedCrossword = await crosswordRepo.save(crosswordEntity);

		const userCrosswordEntity = userCrosswordRepo.create({
			user: {
				user_id: userId,
			},
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
		return crosswordService({ id: String(savedCrossword.crossword_id) });
	} catch (err) {
		await queryRunner.rollbackTransaction();

		throw err;
	} finally {
		await queryRunner.release();
	}
}

const deleteCrossword = async (params: crosswordServiceParams) => {
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
};

interface UpdateCrosswordBody {
	title?: string;
	topic?: string;
	topic_id?: number;
	words?: string[];
	grid_state: string;
	id: string;
	completed?: boolean;
}

async function updateCrosswordService(
	body: UpdateCrosswordBody,
	userId: number,
) {
	const client = AppDataSource;
	const queryRunner = client.createQueryRunner();

	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {
		const crosswordRepo = queryRunner.manager.getRepository(Crossword);
		const topicRepo = queryRunner.manager.getRepository(Topic);
		const wordsRepo = queryRunner.manager.getRepository(Words);
		const crosswordWordsRepo = queryRunner.manager.getRepository(CrosswordWord);
		const userCrosswordRepo = queryRunner.manager.getRepository(UserCrossword);

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
				// Need to handle Existing wood
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
}

export {
	crosswordService,
	createCrossword,
	deleteCrossword,
	updateCrosswordService,
};
