import { AppDataSource } from "../../datasource";
import { UserCrossword } from "../entity/userCrosswords";
import { CustomError } from "../errors/customError";

interface createUserCrosswordBody {
	crossword_id: number;
	completed: boolean;
	grid_state: string;
}


export const createUserCrossword = async (data: createUserCrosswordBody, user_id: number) => {
	const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);

		const userCrossword = userCrosswordRepo.create({
			completed: data.completed,
			grid_state: data.grid_state,
			crossword: {
				crossword_id: data.crossword_id,
			},
			user: {
				user_id,
			},

		});
		if(!userCrossword) {
			throw new CustomError("Error creating UserCrossword", 404)
		}
		
		return await userCrosswordRepo.save(userCrossword);

};

export const getUserCrossword = async (id: number) => {
		const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);
		if(!userCrosswordRepo) {
			throw new CustomError("helloo", 404)
		}
		return await userCrosswordRepo.findOneBy({ user_crossword_id: id });

};

export const updateUserCrossword = async (
	id: number,
	data: Partial<UserCrossword>,
) => {
	const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);
	await userCrosswordRepo.update(id, data);
	return await userCrosswordRepo.findOneBy({ user_crossword_id: id });
};

export const deleteUserCrossword = async (id: number) => {
	const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);
	return await userCrosswordRepo.delete(id);
};
