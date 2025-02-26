import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppDataSource } from "../../datasource";
import { Crosswords, CrosswordTopics, CrosswordWords, Languages, Topics, UserCrosswords, Users, Words } from "../../libs/entity";
import { ServiceError, createUserCrossword, crosswordService } from "../../libs/services/crossword";

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
	const client = AppDataSource.createQueryBuilder(Crosswords, "c");
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return crosswords by name", async () => {
		const mockCrosswords = [
			{
				title: "Sample Crossword",
				word_text: "examtple",
				clue: "A sample clue",
				topic_name: "Sample Topic",
			},
		] as never as Crosswords[];

		vi.mocked(client.getMany).mockResolvedValue(mockCrosswords);
		const result = await crosswordService({ name: "Sample" });

		expect(client.createQueryBuilder).toHaveBeenCalledWith(Crosswords, "c");
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
				word_text: "examtple",
				clue: "A sample clue",
				topic_name: "Sample Topic",
			},
		] as never as Crosswords[];

		vi.mocked(client.getMany).mockResolvedValue(mockCrosswords);
		const result = await crosswordService({ id: "1" });

		expect(client.createQueryBuilder).toHaveBeenCalledWith(Crosswords, "c");
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
				word_text: "examtple",
				clue: "A sample clue",
				topic_name: "Sample Topic",
			},
		] as never as Crosswords[];

		vi.mocked(client.getMany).mockResolvedValue(mockCrosswords);
		const result = await crosswordService();

		expect(client.createQueryBuilder).toHaveBeenCalledWith(Crosswords, "c");
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
		// Get the languages 
		// get the users 
		// Check if the title is unique 
		// 
		vi.mocked(client.getMany).mockRejectedValueOnce("reject");

		await expect(crosswordService({ name: "Sample" })).rejects.instanceOf(
			ServiceError,
		);
	});

	describe("createCrossword", () => {
		const language = AppDataSource.getRepository(Languages);
		const crosswordTopic = AppDataSource.getRepository(CrosswordTopics);
		const topicRepository = AppDataSource.getRepository(Topics);
		const wordsRepo = AppDataSource.getRepository(Words);
		const crosswordWordsRepo = AppDataSource.getRepository(CrosswordWords)
		const userRepository = AppDataSource.getRepository(Users)
		const userCrosswordRepository = AppDataSource.getRepository(UserCrosswords);
		const crosswordRepo = AppDataSource.getRepository(Crosswords);
		it("should throw an error if the query fails", async () => {

			vi.mocked(userRepository.findOneBy).mockResolvedValueOnce({
				user_id: 1,
				username: "Jim",
				password_hash: "",
				email: "jim@doe.com",
				created_at: undefined,
				google_id: "",
				userCrosswords: []
			})

			vi.mocked(language.findOneBy).mockResolvedValueOnce({
				language_id: 2,
				language_code: "EN",
				language_name: "English",
			} as Languages);

			vi.mocked(crosswordRepo.create).mockResolvedValueOnce({
				crossword_id: 8,
				language_id: 0,
				title: "House Objects",
				date_created: undefined,
				difficulty: "Easy",
				isPublic: true,
				language: new Languages,
				crosswordTopics: new CrosswordTopics,
				crosswordWords: [],
				userCrosswords: []
			});

			vi.mocked(userCrosswordRepository.create).mockResolvedValueOnce({
				crossword_id: 8,
				user_crossword_id: 0,
				user_id: 0,
				grid_state: "",
				completed: false,
				last_attempted: undefined,
				user: new Users,
				crossword: new Crosswords
			});

			vi.mocked(crosswordTopic)

			vi.mocked(wordsRepo.findOneBy).mockResolvedValue({
				word_id: 0,
				language_id: 0,
				word_text: "Microwave",
				definition: "",
				language: new Languages,
				crosswordWord: []
			});

		    // Create and save the crossword words
			 await vi.mocked(wordsRepo.findOneBy).mockRejectedValue(undefined);
			vi.mocked(crosswordWordsRepo.create({
					crossword_id: 8,
					word_id: 2,
					clue: "A clue for ",
				}));
            

			vi.mocked(client.getMany).mockRejectedValueOnce("reject");
				const res = await createUserCrossword({
					title: "House Objects", topic: "Objects", words: [
						"Sofa", "Bed", "Microwave", "Desk", "Television"
					], language: "English", userId: 1
				});
			await expect(res).toBeInstanceOf(Crosswords);
		});
	})
});

