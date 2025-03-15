import type { Difficulty, LanguageCode } from "@verbaquest/shared";
import { AppDataSource } from "../../datasource";
import {  User } from "../entity/user/users";
import { UserError } from "../errors";

const userService = {
	async createUser(data: Partial<User>) {
		const userRepo = AppDataSource.getRepository(User);
		const user = userRepo.create(data);
		return await userRepo.save(user);
	},
	async getUserById(user_id: number) {
		const user = AppDataSource.getRepository(User).findOne({
			where: { user_id },
			select: ["user_id", "username",
				"email",
				"preferred_learning_language", "app_language", "preferred_difficulty"]

		});
		if (!user) {
			throw new UserError("USER_NOT_FOUND", 500);
		}
		return user
	},
	async getUserByEmail(email: string) {
		console.log({ email })

		const user = await AppDataSource.getRepository(User).findOneBy({ email });
		if (!user) {
			throw new UserError("USER_NOT_FOUND", 500);
		}
		return user;
	},
	async updateUserSettings(user_id: number, data: Partial<{
		preferred_learning_language: LanguageCode;
		app_language: LanguageCode;
		preferred_difficulty: Difficulty;
	}>) {
		const userRepo = AppDataSource.getRepository(User);
		const user = await this.getUserById(user_id);

		const update = await userRepo.update(user.user_id, data);

		if (!update) {
			throw new UserError("Updated settings failed", 500);
		}
		return update;
	}

}

export default userService;