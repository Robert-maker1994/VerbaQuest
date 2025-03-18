import { AppDataSource } from "../../datasource";
import { UserCrossword } from "../entity";
import { CustomError } from "../errors/customError";

export const userCrosswordService = {
	async getUserCrosswords(user_id: number) {
		try {
			const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);
			const userCrossword = await userCrosswordRepo.find({
				where: {
					user: {
						user_id,
					},
				},
				relations: {
					crossword: {
						topics: true,
					},
				},
				select: ["completed", "completion_timer", "crossword", "last_attempted"]
			});

			return userCrossword;

		} catch (err) {
			throw new CustomError("Error getting UserCrossword", 404);
		}

	},

	async createUserCrossword(
		crossword_id: number,
		timer: number,
		user_id: number,
	) {
		try {

			const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);

			const userCrossword = userCrosswordRepo.create({
				completed: true,
				completion_timer: timer,
				crossword: {
					crossword_id: crossword_id,
				},
				user: {
					user_id,
				},
			});
			if (!userCrossword) {
				throw new CustomError("Error creating UserCrossword", 404);
			}

			return await userCrosswordRepo.save(userCrossword);
		} catch (err) {
			throw new CustomError("Error creating UserCrossword", 404);
		}
	}
}
