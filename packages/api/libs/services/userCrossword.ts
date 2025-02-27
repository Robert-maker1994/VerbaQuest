import { AppDataSource } from "../../datasource";
import { UserCrossword } from "../entity/users";

export const createUserCrossword = async (data: Partial<UserCrossword>) => {
    const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);
    const userCrossword = userCrosswordRepo.create(data);
    return await userCrosswordRepo.save(userCrossword);
};

export const getUserCrossword = async (id: number) => {
    const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);
    return await userCrosswordRepo.findOneBy({ user_crossword_id: id });
};

export const updateUserCrossword = async (id: number, data: Partial<UserCrossword>) => {
    const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);
    await userCrosswordRepo.update(id, data);
    return await userCrosswordRepo.findOneBy({ user_crossword_id: id });
};

export const deleteUserCrossword = async (id: number) => {
    const userCrosswordRepo = AppDataSource.getRepository(UserCrossword);
    return await userCrosswordRepo.delete(id);
};