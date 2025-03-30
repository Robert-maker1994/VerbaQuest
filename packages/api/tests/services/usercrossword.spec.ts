// import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// import { AppDataSource } from "../../datasource";
// import { UserCrossword } from "../../libs/entity";
// import { CustomError } from "../../libs/errors/customError";
// import { userCrosswordService } from "../../libs/services";

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
// 			create: vi.fn().mockReturnThis(),
// 			find: vi.fn().mockReturnThis(),
// 			save: vi.fn().mockReturnThis(),
// 			upsert: vi.fn().mockReturnThis(),
// 			findOne: vi.fn().mockReturnThis(),
// 		},
// 	};
// });

// describe("userCrosswordService", () => {
// 	const topicRepo = AppDataSource.getRepository(UserCrossword);

// 	beforeEach(() => {
// 		vi.clearAllMocks();
// 	});

// 	afterEach(() => {
// 		vi.clearAllMocks();
// 	});

// 	describe("getUserCrosswords", () => {
// 		it("should return user crosswords successfully", async () => {
// 			const mockUserCrosswords = [
// 				{
// 					completed: true,
// 					completion_timer: 100,
// 					last_attempted: new Date(),
// 					user_crossword_id: 1,
// 					crossword: {
// 						crossword_id: 1,
// 						title: "Crossword 1",
// 						difficulty: "easy",
// 						topics: [{ topic_id: 1, topic_name: "Topic 1" }],
// 					},
// 				},
// 			];
// 			const topicRepo = AppDataSource.getRepository(UserCrossword);
// 			vi.mocked(topicRepo.find).mockResolvedValue(
// 				mockUserCrosswords as UserCrossword[],
// 			);

// 			const result = await userCrosswordService.getAll(1);
// 			expect(result).toEqual(mockUserCrosswords);
// 			expect(topicRepo.find).toHaveBeenCalledWith({
// 				where: { user: { user_id: 1 } },
// 				cache: true,
// 				relations: { crossword: { topics: true } },
// 				select: {
// 					completed: true,
// 					completion_timer: true,
// 					last_attempted: true,
// 					user_crossword_id: true,
// 					crossword: {
// 						crossword_id: true,
// 						title: true,
// 						difficulty: true,
// 						topics: { topic_id: true, topic_name: true },
// 					},
// 				},
// 			});
// 		});
// 	});

// 	describe("createOrUpdate", () => {
// 		it("should create a user crossword successfully", async () => {
// 			const mockUserCrossword = {
// 				completed: true,
// 				completion_timer: 100,
// 				crossword: { crossword_id: 1 },
// 				user: { user_id: 1 },
// 				user_crossword_id: 1,
// 			};
// 			vi.mocked(topicRepo.findOne).mockResolvedValue(
// 				mockUserCrossword as UserCrossword,
// 			);

// 			const result = await userCrosswordService.createOrUpdate(1, 100, 1);
// 			expect(result).toEqual(mockUserCrossword);
// 			expect(topicRepo.upsert).toBeCalled();
// 		});

// 		it("should throw a CustomError if an error occurs during creation", async () => {
// 			vi.mocked(topicRepo.findOne).mockReturnValue(null);
// 			await expect(
// 				userCrosswordService.createOrUpdate(1, 100, 1),
// 			).rejects.toThrowError(
// 				new CustomError("Error creating or updating UserCrossword", 404),
// 			);
// 		});

// 		it("should throw a CustomError if an error occurs during saving", async () => {
// 			const mockUserCrossword = {
// 				completed: true,
// 				completion_timer: 100,
// 				crossword: { crossword_id: 1 },
// 				user: { user_id: 1 },
// 				user_crossword_id: 1, // Add a user_crossword_id for completeness
// 			};
// 			vi.mocked(topicRepo.findOne).mockResolvedValue(
// 				mockUserCrossword as UserCrossword,
// 			);

// 			try {
// 				vi.mocked(topicRepo.upsert).mockRejectedValue("Error");
// 				await userCrosswordService.createOrUpdate(1, 100, 1);
// 			} catch (error) {
// 				expect(error).toBeInstanceOf(CustomError);
// 				expect(error.message).toBe("Error creating or updating UserCrossword");
// 			}
// 		});
// 	});
// });
