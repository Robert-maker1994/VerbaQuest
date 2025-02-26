import { error } from "console";
import { AppDataSource } from "../../datasource";
import { Crosswords, CrosswordWords, Languages, Topics, UserCrosswords, Words } from "../entity";
import { LanguageError, TopicError, WordError } from "../errors";

type crosswordServiceParams = { id?: string; name?: string };

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
			.select(["c.title", "w.word_text", "cw.clue", "t.topic_name"]);

		if (q?.name) {
			const query = q?.name;
			crossword.where("unaccent(Lower(t.topic_name)) ILike :name", {
				name: `%${query?.toLowerCase()}%`,
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

interface CreateCrosswordBody {
	title: string,
	topic: string,
	words: string[],
	language: string,
	userId: number
}

async function createUserCrossword(body: CreateCrosswordBody) {
	const client = AppDataSource;
	const queryRunner = client.createQueryRunner();

	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {
		const { title, topic, words, language, userId } = body;

		const languageRepo = queryRunner.manager.getRepository(Languages);
		const topicRepo = queryRunner.manager.getRepository(Topics);
		const crosswordRepo = queryRunner.manager.getRepository(Crosswords);
		const userCrosswordRepo = queryRunner.manager.getRepository(UserCrosswords);
		const wordsRepo = queryRunner.manager.getRepository(Words);
		const crosswordWordsRepo = queryRunner.manager.getRepository(CrosswordWords);

		const languageEntity = await languageRepo.findOneBy({ language_name: language });

		if (!languageEntity) {
			throw new LanguageError("Unknown language, please provide a different language", 200);
		}
		const existingTopic = await topicRepo.findOneBy({ topic_name: topic });

		if (existingTopic) {
			throw new TopicError("Topic is already defined", 200);
		}
		try {

			const topicEntity = topicRepo.create({
				topic_name: topic,
				language_id: languageEntity.language_id,
			});
			await topicRepo.save(topicEntity);
		} catch (err) {
			console.error(err)
			throw new TopicError("Error saving topic", 200);

		}

		const crosswordEntity = crosswordRepo.create({
			title,
			language_id: languageEntity.language_id,
			difficulty: "easy",
			isPublic: false,
		});
		const savedCrossword = await crosswordRepo.save(crosswordEntity);
		console.log({ savedCrossword })
		const userCrosswordEntity = userCrosswordRepo.create({
			user_id: userId,
			crossword_id: savedCrossword.crossword_id,
			grid_state: "",
			completed: false,
		});
		await userCrosswordRepo.save(userCrosswordEntity);
		console.log({ userCrosswordEntity })

		for (const word of words) {
			let existingWord = await wordsRepo.findOneBy({ word_text: word });
			if (!existingWord) {
				existingWord = wordsRepo.create({
					word_text: word,
					language_id: languageEntity.language_id,
				});
				await wordsRepo.save(existingWord);
			}
			const crosswordWordEntity = crosswordWordsRepo.create({
				crossword_id: savedCrossword.crossword_id,
				word_id: existingWord.word_id,
				clue: "Not implemented",
			});
			await crosswordWordsRepo.save(crosswordWordEntity);
		}
		console.log({ savedCrossword })
		await queryRunner.commitTransaction();
		return crosswordService({ id: String(savedCrossword.crossword_id) });
	} catch (err) {
		await queryRunner.rollbackTransaction();
		console.error(err)
		throw new ServiceError(`Error creating crossword: ${err}`);
	} finally {
		await queryRunner.release();
	}
}

export { crosswordService, createUserCrossword };
