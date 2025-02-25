import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppDataSource } from "../../datasource";
import { Crosswords } from "../../libs/entity";
import { ServiceError, crosswordService } from "../../libs/services/crossword";

const mocks = vi.hoisted(() => {
	return {
		AppDataSource: {
			createQueryBuilder: vi.fn().mockReturnThis(),
			leftJoinAndSelect: vi.fn().mockReturnThis(),
			select: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
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
		vi.mocked(client.getMany).mockRejectedValueOnce("reject");

		await expect(crosswordService({ name: "Sample" })).rejects.instanceOf(
			ServiceError,
		);
	});
});
