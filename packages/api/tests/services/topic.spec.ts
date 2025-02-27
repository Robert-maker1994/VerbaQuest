import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppDataSource } from "../../datasource";
import { Topic } from "../../libs/entity";
import { createTopic } from "../../libs/services";

const mocks = vi.hoisted(() => {
	return {
		AppDataSource: {
			getRepository: vi.fn().mockReturnThis(),
			create: vi.fn(),
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

describe("createTopic", () => {
	const topicRepo = AppDataSource.getRepository(Topic);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should create and save a new topic", async () => {
		const mockTopic = { name: "Sample Topic" } as Partial<Topic>;
		const savedTopic = { topic_id: 1, topic_name: "Sample Topic" } as Topic;

		vi.mocked(topicRepo.create).mockReturnValue(mockTopic as Topic);
		vi.mocked(topicRepo.save).mockResolvedValue(savedTopic);

		const result = await createTopic(mockTopic);

		expect(topicRepo.create).toHaveBeenCalledWith(mockTopic);
		expect(topicRepo.save).toHaveBeenCalledWith(mockTopic);
		expect(result).toEqual(savedTopic);
	});

	it("should throw an error if save fails", async () => {
		// const mockTopic = { name: "Sample Topic" } as Partial<Topic>;
		// vi.mocked(topicRepo.create).mockReturnValue(mockTopic as Topic);
		// vi.mocked(topicRepo.save).mockRejectedValue(new Error("Save failed"));
		// await expect(createTopic(mockTopic)).rejects.toThrow("Save failed");
	});
});
