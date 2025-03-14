import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppDataSource } from "../../datasource";
import {
	Crossword,
	CrosswordWord,
	LanguageName,
	Languages,
	User,
	UserCrossword,
	Words,
} from "../../libs/entity";
import { CustomError } from "../../libs/errors/customError";
import {
	createCrossword,
	crosswordService,
} from "../../libs/services/crosswordService";

const mocks = vi.hoisted(() => {
	return {
		AppDataSource: {
			createQueryBuilder: vi.fn().mockReturnThis(),
			leftJoinAndSelect: vi.fn().mockReturnThis(),
			select: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			getMany: vi.fn(),
			getRepository: vi.fn().mockReturnThis(),
			findOneBy: vi.fn(),
			create: vi.fn().mockReturnThis(),
			leftJoin: vi.fn().mockReturnThis(),
			save: vi.fn(),
		},
	};
});
vi.mock("../../datasource.ts", async (importOriginal) => {
	const mod = await importOriginal();
	return {
		AppDataSource: mocks.AppDataSource,
	};
});

describe("crosswordService", () => {
	const client = AppDataSource.createQueryBuilder(Crossword, "c");
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return crosswords by name", async () => {
		const mockCrosswords = [
			{
				title: "Sample Crossword",
				word_text: "example",
				clue: "A sample clue",
				topic_name: "Sample Topic",
			},
		] as never as Crossword[];

		vi.mocked(client.getMany).mockResolvedValue(mockCrosswords);
		const result = await crosswordService({ name: "Sample" });

		expect(client.createQueryBuilder).toHaveBeenCalledWith(Crossword, "c");
		expect(client.leftJoinAndSelect).toBeCalledTimes(4);

		expect(client.select).toHaveBeenCalledWith([
			"c.title",
			"w.word_text",
			"cw.clue",
			"t.topic_name",
		]);

		expect(client.where).toHaveBeenCalledWith(
			"unaccent(Lower(t.topic_name)) ILike :name",
			{
				name: "%sample%",
			},
		);

		expect(client.where).not.toHaveBeenCalledWith("c.crossword_id = :id", {
			id: "1",
		});

		expect(client.getMany).toHaveBeenCalled();
		expect(result).toEqual(mockCrosswords);
	});

	it("should return crosswords by id", async () => {
		const mockCrosswords = [
			{
				title: "Sample Crossword",
				word_text: "example",
				clue: "A sample clue",
				topic_name: "Sample Topic",
			},
		] as never as Crossword[];

		vi.mocked(client.getMany).mockResolvedValue(mockCrosswords);
		const result = await crosswordService({ id: "1" });

		expect(client.createQueryBuilder).toHaveBeenCalledWith(Crossword, "c");
		expect(client.leftJoinAndSelect).toBeCalledTimes(4);

		expect(client.select).toHaveBeenCalledWith([
			"c.title",
			"w.word_text",
			"cw.clue",
			"t.topic_name",
		]);

		expect(client.where).not.toHaveBeenCalledWith(
			"unaccent(Lower(t.topic_name)) ILike :name",
			{
				name: "%sample%",
			},
		);

		expect(client.where).toHaveBeenCalledWith("c.crossword_id = :id", {
			id: "1",
		});

		expect(client.getMany).toHaveBeenCalled();
		expect(result).toEqual(mockCrosswords);
	});

	it("should return all crosswords when not provided any parameters", async () => {
		const mockCrosswords = [
			{
				title: "Sample Crossword",
				word_text: "example",
				clue: "A sample clue",
				topic_name: "Sample Topic",
			},
		] as never as Crossword[];

		vi.mocked(client.getMany).mockResolvedValue(mockCrosswords);
		const result = await crosswordService();

		expect(client.createQueryBuilder).toHaveBeenCalledWith(Crossword, "c");
		expect(client.leftJoinAndSelect).toBeCalledTimes(4);

		expect(client.select).toHaveBeenCalledWith([
			"c.title",
			"w.word_text",
			"cw.clue",
			"t.topic_name",
		]);

		expect(client.where).not.toHaveBeenCalledWith(
			"unaccent(Lower(t.topic_name)) ILike :name",
			{
				name: "%sample%",
			},
		);

		expect(client.where).not.toHaveBeenCalledWith("c.crossword_id = :id", {
			id: "1",
		});

		expect(client.getMany).toHaveBeenCalled();
		expect(result).toEqual(mockCrosswords);
	});

	it("should throw an error if the query fails", async () => {
		vi.mocked(client.getMany).mockRejectedValueOnce("reject");

		await expect(crosswordService({ name: "Sample" })).rejects.instanceOf(
			CustomError,
		);
	});

	describe("createCrossword", () => {
		const language = AppDataSource.getRepository(Languages);
		const wordsRepo = AppDataSource.getRepository(Words);
		const crosswordWordsRepo = AppDataSource.getRepository(CrosswordWord);
		const userRepository = AppDataSource.getRepository(User);
		const userCrosswordRepository = AppDataSource.getRepository(UserCrossword);
		const crosswordRepo = AppDataSource.getRepository(Crossword);

		it("should throw an error if the query fails", async () => {
			vi.mocked(userRepository.findOneBy).mockResolvedValueOnce({
				user_id: 1,
				username: "Jim",
				password_hash: "",
				email: "jim@doe.com",
				created_at: undefined,
				google_id: "",
				userCrosswords: [],
			});

			vi.mocked(language.findOneBy).mockResolvedValueOnce({
				language_id: 2,
				language_code: "EN",
				language_name: "English",
			} as Languages);

			vi.mocked(crosswordRepo.create).mockResolvedValueOnce({
				crossword_id: 8,

				title: "House Objects",
				date_created: undefined,
				difficulty: 1,
				is_Public: true,
				language: new Languages(),
				crosswordWords: [],
				userCrosswords: [],
				topics: [],
			});

			vi.mocked(userCrosswordRepository.create).mockResolvedValueOnce({
				user_crossword_id: 0,
				grid_state: "",
				completed: false,
				last_attempted: undefined,
				user: new User(),
				crossword: new Crossword(),
			});

			vi.mocked(wordsRepo.findOneBy).mockResolvedValue({
				word_id: 0,
				word_text: "Microwave",
				definition: "",
				language: new Languages(),
				wordle_valid: false,
				crosswordWords: [],
			});

			vi.mocked(wordsRepo.findOneBy).mockRejectedValue(undefined);
			vi.mocked(crosswordWordsRepo.create).mockReturnValue({
				clue: "A clue for ",
				crossword_word_id: 0,
				crossword: new Crossword(),
				words: new Words(),
			});

			vi.mocked(client.getMany).mockRejectedValueOnce("reject");

			const res = await createCrossword({
				title: "House Objects",
				topic: "Objects",
				words: ["Sofa", "Bed", "Microwave", "Desk", "Television"],
				userId: 1,
				language: LanguageName.ENGLISH,
			});

			await expect(res).toBeInstanceOf(Crossword);
		});
	});
});
