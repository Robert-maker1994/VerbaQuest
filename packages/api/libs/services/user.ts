import { AppDataSource } from "../../datasource";
import { User } from "../entity/users";

export const createUser = async (data: Partial<User>) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = userRepo.create(data);
    return await userRepo.save(user);
};

export const getUser = async (id: number) => {
    const userRepo = AppDataSource.getRepository(User);
    return await userRepo.findOneBy({ user_id: id });
};

export const updateUser = async (id: number, data: Partial<User>) => {
    const userRepo = AppDataSource.getRepository(User);
    await userRepo.update(id, data);
    return await userRepo.findOneBy({ user_id: id });
};

export const deleteUser = async (id: number) => {
    const userRepo = AppDataSource.getRepository(User);
    return await userRepo.delete(id);
};