// import { describe, expect, it, vi } from "vitest";
// import { AppDataSource } from "../../datasource";
// import { Crossword } from "../../libs/entity";
// import { CrosswordError } from "../../libs/errors";
// import crosswordService from "../../libs/services/crosswordService";
// import { LanguageCode } from "@verbaquest/types";

// vi.mock("../../datasource", () => ({
// 	AppDataSource: {
// 		createQueryBuilder: vi.fn(),
// 		leftJoinAndSelect: vi.fn().mockReturnThis(),
// 		where: vi.fn().mockReturnThis(),
// 		andWhere: vi.fn().mockReturnThis(),
// 		orderBy: vi.fn().mockReturnThis(),
// 		skip: vi.fn().mockReturnThis(),
// 		take: vi.fn().mockReturnThis(),
// 		getManyAndCount: vi.fn(),
// 	},
// }));

// describe("crosswordService", () => {
// 	describe("getCrosswordDetails", () => {
// 		it("should handle invalid parameters", async () => {
// 			try {
// 				vi.mocked(AppDataSource.getManyAndCount).mockReturnValue([[], 0]);
// 				await expect(
// 					crosswordService.getCrosswordDetails(
// 						"hello" as unknown as number,
// 						LanguageCode.ENGLISH
// 					),
// 				).rejects.instanceOf(CrosswordError);
// 			} catch (error) {
// 				expect(error.message).toEqual("INVALID_PARAMS");
// 			}
// 		});
// 	});
// });
