import { AppDataSource } from "../../datasource";
import { Topic } from "../entity/topic";

export const getTopics = async () => {
	const topicRepo = AppDataSource.getRepository(Topic);
	return await topicRepo.find();
};

export const createTopic = async (data: Partial<Topic>) => {
	const topicRepo = AppDataSource.getRepository(Topic);
	const topic = topicRepo.create(data);
	return await topicRepo.save(topic);
};
