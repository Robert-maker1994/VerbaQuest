import { AppDataSource } from "../../datasource";
import { Words } from "../entity";

export const getWords = async () => {
    const wordsRepo = AppDataSource.getRepository(Words);
    return await wordsRepo.find();
};

export const createWord = async (data: Partial<Words>) => {
    const wordsRepo = AppDataSource.getRepository(Words);
    const word = wordsRepo.create(data);
    return await wordsRepo.save(word);
};