import { AppDataSource } from "../../datasource";
import type { LanguageCode } from "../entity";
import { type Difficulty, User } from "../entity/user/users";
import { UserError } from "../errors";

const userService = {
	async createUser(data: Partial<User>) {
		const userRepo = AppDataSource.getRepository(User);
		const user = userRepo.create(data);
		return await userRepo.save(user);
	},
	async getUserById(user_id: number) {
		const user = AppDataSource.getRepository(User).findOneBy({ user_id });
		if (!user) {
			throw new UserError("USER_NOT_FOUND", 500);
		}
		return {
			
		};
	},
	async getUserByEmail(email: string) {
		console.log({email})

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