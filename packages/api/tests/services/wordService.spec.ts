// import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// import { AppDataSource } from "../../datasource";
// import { type Languages, Word } from "../../libs/entity";
// import { CustomError } from "../../libs/errors/customError";
// import { getWordleWord } from "../../libs/services";

// vi.mock("../../datasource.ts", async (importOriginal) => {
// 	const mod = await importOriginal();
// 	return {
// 		AppDataSource: mocks.AppDataSource,
// 	};
// });
// const mocks = vi.hoisted(() => {
// 	return {
// 		AppDataSource: {
// 			getRepository: vi.fn().mockReturnThis(),
// 			createQueryBuilder: vi.fn().mockReturnThis(),
// 			innerJoinAndSelect: vi.fn().mockReturnThis(),
// 			where: vi.fn().mockReturnThis(),
// 			andWhere: vi.fn().mockReturnThis(),
// 			orderBy: vi.fn().mockReturnThis(),
// 			limit: vi.fn().mockReturnThis(),
// 			offset: vi.fn().mockReturnThis(),
// 			getOne: vi.fn().mockReturnThis(),
// 		},
// 	};
// });

// describe("wordService", () => {
// 	beforeEach(() => {
// 		vi.clearAllMocks();
// 	});

// 	afterEach(() => {
// 		vi.clearAllMocks();
// 	});

<<<<<<< HEAD
// 	describe("getWordleword", () => {
// 		it("should return one valid word successfully", async () => {
// 			const wordleWord: Word = {
// 				word_id: 1,
// 				wordle_valid: true,
// 				word_text: "hello",
// 				language: {
// 					language_id: 1,
// 					language_name: "en",
// 					language_code: "en",
// 				} as unknown as Languages,
// 				definition: "",
// 				crosswordWords: [],
// 				userWordProgress: [],
// 				partOfSpeech: ""
// 			};
// 			const wordRepo = AppDataSource.getRepository(Word);
// 			vi.mocked(wordRepo.createQueryBuilder().getOne).mockResolvedValue(
// 				wordleWord,
// 			);
=======
	describe("getWordleword", () => {
		it("should return one valid word successfully", async () => {
			const wordleWord: Word = {
				word_id: 1,
				wordle_valid: true,
				word_text: "hello",
				language: {
					language_id: 1,
					language_name: "en",
					language_code: "en",
				} as Languages,
				definition: "",
				crosswordWords: [],
			};
			const wordRepo = AppDataSource.getRepository(Word);
			vi.mocked(wordRepo.createQueryBuilder().getOne).mockResolvedValue(
				wordleWord,
			);
>>>>>>> master

// 			const result = await getWordleWord("en");
// 			expect(result).toEqual(wordleWord);
// 		});

<<<<<<< HEAD
// 		it("should throw an error message if a word is not found", async () => {
// 			const wordleWord = {};
// 			const wordRepo = AppDataSource.getRepository(Word);

// 			vi.mocked(wordRepo.createQueryBuilder().getOne).mockResolvedValue(
// 				wordleWord as Word,
// 			);
=======
		it("should throw an error message if a word is not found", async () => {
			const wordleWord = {};
			const wordRepo = AppDataSource.getRepository(Word);

			vi.mocked(wordRepo.createQueryBuilder().getOne).mockResolvedValue(
				wordleWord as Word,
			);
>>>>>>> master

// 			try {
// 				const result = await getWordleWord("en");
// 			} catch (error) {
// 				expect(error).toBeInstanceOf(CustomError);
// 			}
// 		});
// 	});
// });
