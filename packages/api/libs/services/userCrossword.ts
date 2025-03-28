import { AppDataSource } from "../../datasource";
import { UserCrossword } from "../entity";
import { CustomError } from "../errors/customError";

class UserCrosswordError extends CustomError {}

export const userCrosswordService = {
	async getByUserCrosswordId(user_id: number, crossword_id: number) {
		try {
			const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);

			const userCrossword = await userCrosswordRepo.findOneBy({
				user: { user_id },
				crossword: { crossword_id },
			});

			return userCrossword;
		} catch (err) {
			throw new UserCrosswordError("Error finding UserCrossword", 404);
		}
	},

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
			throw new UserCrosswordError("Error getting UserCrossword", 404);
		}
	},

	async getFavorite(user_id: number) {
		try {
			const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);

			const userCrossword = await userCrosswordRepo.find({
				where: {
					user: {
						user_id,
					},
					is_favorite: true,
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
			throw new UserCrosswordError("Error getting UserCrossword", 404);
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
			throw new UserCrosswordError("Error getting UserCrossword", 404);
		}
	},

	async createOrUpdate(
		crossword_id: number,
		timer: number,
		user_id: number,
		completed: boolean,
		is_favorite: boolean,
	) {
		try {
			const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);

			const result = await userCrosswordRepo.upsert(
				{
					user: { user_id },
					crossword: { crossword_id },
					completed,
					is_favorite,
					completion_timer: timer,
					last_attempted: new Date(),
				},
				["user_id", "crossword_id"],
			);
			if (!result) {
				console.info("Error upserting UserCrossword", result);
				throw new UserCrosswordError("Error upsetting UserCrossword", 404);
			}

			const userCrossword = await userCrosswordRepo.findOne({
				where: {
					user: { user_id },
					crossword: { crossword_id },
				},
			});

			if (!userCrossword) {
				throw new UserCrosswordError(
					"Error creating or updating UserCrossword",
					404,
				);
			}

			return userCrossword;
		} catch (err) {
			console.log(err);
			throw new UserCrosswordError(
				"Error creating or updating UserCrossword",
				404,
			);
		}
	},

	async update(user_id: number, crossword_id: number, is_favorite: boolean) {
		try {
			const qb = await AppDataSource.createQueryBuilder()
				.update(UserCrossword)
				.set({
					is_favorite,
				})

				.where("user_id = :user_id", { user_id })
				.andWhere("crossword_id = :crossword_id", { crossword_id })
				.execute();

			if (!qb) {
				throw new UserCrosswordError("Error updating UserCrossword", 500);
			}

			return qb;
		} catch (err) {
			throw new UserCrosswordError("Error updating UserCrossword", 404);
		}
	},

	async create(user_id: number, crossword_id: number, is_favorite: boolean) {
		try {
			const qb = await AppDataSource.createQueryBuilder()
				.insert()
				.into(UserCrossword)
				.values({
					user: { user_id },
					crossword: { crossword_id },
					is_favorite,
				})
				.execute();

			return qb;
		} catch (err) {
			throw new UserCrosswordError("Error updating UserCrossword", 404);
		}
	},

	async delete(user_id: number, crossword_id: number) {
		try {
			const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);
			const userCrossword = await userCrosswordRepo
				.createQueryBuilder("uc")
				.delete()
				.from(UserCrossword)
				.where("user_id = :user_id", { user_id })
				.andWhere("crossword_id = :crossword_id", { crossword_id })
				.execute();
			return userCrossword;
		} catch (err) {
			throw new UserCrosswordError("Error deleting UserCrossword", 404);
		}
	},
};
