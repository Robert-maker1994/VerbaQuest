import { AppDataSource } from "../../datasource";
import { Words } from "../entity";
import { CustomError } from "../errors/customError";

class WordServiceError extends CustomError { }

const wordService = {

	async getWords() {
		const wordsRepo = AppDataSource.getRepository(Words);
		return await wordsRepo.find();
	},

	async getWordleWord(language: string) {
		const wordsRepo = AppDataSource.getRepository(Words);

		const word = await wordsRepo
			.createQueryBuilder("word")
			.innerJoinAndSelect("word.language", "language")
			.where("word.wordle_valid = :wordleValid", { wordleValid: true })
			.andWhere("language.language_code = :languageCode", {
				languageCode: language,
			})
			.orderBy("RANDOM()")
			.select([
				"word.word_id",
				"word.word_text",
				"word.definition",
				"language.language_code"
			])
			.getOne();

		if (!word.word_id) {
			throw new WordServiceError("NOT_FOUND", 404)
		}
		return word;
	},
	async createWord(data: Partial<Words>) {
		const wordsRepo = AppDataSource.getRepository(Words);
		const word = wordsRepo.create(data);
		return await wordsRepo.save(word);
	}
}

export default wordService;