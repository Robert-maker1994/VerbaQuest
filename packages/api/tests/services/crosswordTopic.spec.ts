import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppDataSource } from "../../datasource";
import { getCrosswordTopic } from "../../libs/controller/crosswordTopic";
import {
	CrosswordTopics,
	Crosswords,
	Languages,
	Topics,
} from "../../libs/entity";
import { ServiceError } from "../../libs/services/crossword";
import {
	CrosswordTopicError,
	createCrosswordTopicService,
	getAllCrosswordTopics,
	getCrosswordTopicById,
	getCrosswordTopicByName,
} from "../../libs/services/crosswordTopic";
import { LanguageError } from "../../libs/errors";

const mocks = vi.hoisted(() => {
	return {
		AppDataSource: {
			getRepository: vi.fn().mockReturnThis(),
			findOneBy: vi.fn(),
			create: vi.fn().mockReturnThis(),
			createQueryBuilder: vi.fn().mockReturnThis(),
			leftJoin: vi.fn().mockReturnThis(),
			leftJoinAndSelect: vi.fn().mockReturnThis(),
			select: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			save: vi.fn(),
			getMany: vi.fn(),
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
	const client = AppDataSource.createQueryBuilder(CrosswordTopics, "c");
	beforeEach(() => {
		vi.clearAllMocks();
	});
	describe("getAllCrosswordTopics", () => {
		it("should return all topics", async () => {
			const crosswordTopicResponse = [
				{
					crossword_topic_id: 1,
					topics: {
						topic_name: "Days of the week",
					},
				},
				{
					crossword_topic_id: 2,
					topics: {
						topic_name: "Sports",
					},
				},
			] as CrosswordTopics[];

			vi.mocked(client.getMany).mockResolvedValueOnce(crosswordTopicResponse);
			const res = await getAllCrosswordTopics();

			expect(res).toBe(crosswordTopicResponse);
			expect(client.leftJoin).toBeCalledTimes(1);
		});

		it("Error from data base should be a instance of crosswordTopicError", async () => {
			vi.mocked(client.getMany).mockRejectedValueOnce(new Error());

			try {
				await getAllCrosswordTopics();
			} catch (err) {
				expect(err).toBeInstanceOf(CrosswordTopicError);
			}
		});
	});
	describe("getCrosswordTopicById", () => {
		it("should get the pass the correct id to the client", async () => {
			const crosswordTopicResponse = [
				{
					crossword_topic_id: 1,
					topics: {
						topic_name: "Days of the week",
					},
				},
				{
					crossword_topic_id: 2,
					topics: {
						topic_name: "Sports",
					},
				},
			] as CrosswordTopics[];

			vi.mocked(client.getMany).mockResolvedValueOnce(crosswordTopicResponse);
			const res = await getCrosswordTopicById(1);

			expect(res).toBe(crosswordTopicResponse);
			expect(client.where).toHaveBeenCalledWith("ct.crossword_topic_id = :id", {
				id: 1,
			});
		});

		it("should error should be an instant of Crossword topic", async () => {
			vi.mocked(client.getMany).mockRejectedValueOnce(new Error());

			try {
				await getAllCrosswordTopics();
			} catch (err) {
				expect(err).toBeInstanceOf(CrosswordTopicError);
			}
		});
	});

	describe("getCrosswordTopicByName", () => {
		it("should get the pass the correct name", async () => {
			const crosswordTopicResponse = [
				{
					crossword_topic_id: 1,
					topics: {
						topic_name: "Days of the week",
					},
				},
				{
					crossword_topic_id: 2,
					topics: {
						topic_name: "Sports",
					},
				},
			] as CrosswordTopics[];

			vi.mocked(client.getMany).mockResolvedValueOnce(crosswordTopicResponse);
			const res = await getCrosswordTopicByName("Football");

			expect(res).toBe(crosswordTopicResponse);
			expect(client.where).toHaveBeenCalledWith(
				"unaccent(Lower(t.topic_name)) ILike :name",
				{ name: "%football%" },
			);
			expect(client.leftJoinAndSelect).toBeCalledTimes(1);
		});

		it("should error should be an instant of Crossword topic", async () => {
			vi.mocked(client.getMany).mockRejectedValueOnce(new Error());

			try {
				await getCrosswordTopicByName("soccer");
			} catch (err) {
				expect(err).toBeInstanceOf(CrosswordTopicError);
			}
		});
	});

	describe("createCrosswordTopicService", () => {
		const language = AppDataSource.getRepository(Languages);
		const crosswordTopic = AppDataSource.getRepository(CrosswordTopics);
		it("should throw error if the the language doesnt exist", async () => {
			vi.mocked(language.findOneBy).mockResolvedValueOnce(null);

			await createCrosswordTopicService({
				topicName: "Sports",
				language: "FR",
				difficulty: "easy",
				crosswordTitle: "Sports",
			}).catch((err) => {
				expect(err).toBeInstanceOf(LanguageError);
			});
		});

		it("should return 200 if the crossword is saved correctly", async () => {
			vi.mocked(language.findOneBy).mockResolvedValueOnce({
				language_id: 2,
				language_code: "EN",
				language_name: "English",
			} as Languages);

			const response = {
				crossword_topic_id: 3,
				topics: {
					topic_name: "Sports",
				},
			} as CrosswordTopics;

			const crosswordRepository = AppDataSource.getRepository(Crosswords);
			const topicRepository = AppDataSource.getRepository(Topics);

			vi.mocked(topicRepository.save).mockResolvedValueOnce({
				topic_name: "Sports",
				language_id: 2,
			} as Topics);

			vi.mocked(crosswordRepository.save).mockResolvedValueOnce({
				title: "Sports",
				language_id: 2,
				difficulty: "easy",
				crossword_id: 3,
			} as Crosswords);

			vi.mocked(crosswordTopic.save).mockResolvedValueOnce(response);

			const res = await createCrosswordTopicService({
				topicName: "Sports",
				language: "English",
				difficulty: "easy",
				crosswordTitle: "Sports",
			});

			expect(res).toBe(response);
		});

		it("should error should be an instant of Crossword topic", async () => {
			const crosswordRepository = AppDataSource.getRepository(Crosswords);
			const topicRepository = AppDataSource.getRepository(Topics);
			vi.mocked(language.findOneBy).mockResolvedValueOnce({
				language_id: 2,
				language_code: "EN",
				language_name: "English",
			} as Languages);

			vi.mocked(topicRepository.save).mockResolvedValueOnce({
				topic_name: "Sports",
				language_id: 2,
			} as Topics);

			vi.mocked(crosswordRepository.save).mockResolvedValueOnce({
				title: "Sports",
				language_id: 2,
				difficulty: "easy",
				crossword_id: 3,
			} as Crosswords);

			try {
				vi.mocked(crosswordTopic.save).mockRejectedValueOnce(
					new CrosswordTopicError("nnoo", 500),
				);

				await createCrosswordTopicService({
					topicName: "Sports",
					language: "English",
					difficulty: "easy",
					crosswordTitle: "Sports",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(CrosswordTopicError);
			}
		});
	});
});
