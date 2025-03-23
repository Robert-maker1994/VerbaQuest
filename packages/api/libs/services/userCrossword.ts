import { AppDataSource } from "../../datasource";
import { UserCrossword } from "../entity";
import { CustomError } from "../errors/customError";

export const userCrosswordService = {
	async getLatest(user_id: number) {
		try {
			const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);

			const userCrossword = await userCrosswordRepo.find({
				where: {
					user: {
						user_id,
					},
				},
				cache: true,
				relations: {
					crossword: {
						topics: true,
					},
				},
				select: {
					completed: true,
					completion_timer: true,
					last_attempted: true,
					user_crossword_id: true,
					crossword: {
						crossword_id: true,
						title: true,
						difficulty: true,
						topics: {
							topic_id: true,
							topic_name: true,
						},
					},
				},
				order: {
					last_attempted: "DESC",
				},
				take: 3,
			});

			return userCrossword;
		} catch (err) {
			throw new CustomError("Error getting UserCrossword", 404);
		}
	},

	async getAll(user_id: number) {
		try {
			const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);

			const userCrossword = await userCrosswordRepo.find({
				where: {
					user: {
						user_id,
					},
				},
				cache: true,
				relations: {
					crossword: {
						topics: true,
					},
				},
				select: {
					completed: true,
					completion_timer: true,
					last_attempted: true,
					user_crossword_id: true,
					crossword: {
						crossword_id: true,
						title: true,
						difficulty: true,
						topics: {
							topic_id: true,
							topic_name: true,
						},
					},
				},
			});

			return userCrossword;
		} catch (err) {
			throw new CustomError("Error getting UserCrossword", 404);
		}
	},

	async createOrUpdate(crossword_id: number, timer: number, user_id: number) {
		try {
			const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);

			const result = await userCrosswordRepo.upsert(
				{
					user: { user_id },
					crossword: { crossword_id },
					completed: true,
					completion_timer: timer,
					last_attempted: new Date(),
				},
				["user_id", "crossword_id"]

			);
			if (!result) {
				console.info("Error upserting UserCrossword", result);
				throw new CustomError("Error upsetting UserCrossword", 404);
			}

			const userCrossword = await userCrosswordRepo.findOne({
				where: {
					user: { user_id },
					crossword: { crossword_id },
				},
			});

			if (!userCrossword) {
				throw new CustomError("Error creating or updating UserCrossword", 404);
			}

			return userCrossword;
		} catch (err) {
			console.log(err)
			throw new CustomError("Error creating or updating UserCrossword", 404);
		}
	},
};
