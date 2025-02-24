import { AppDataSource } from "../../datasource";
import { Crosswords, CrosswordTopics, Languages, Topics } from "../entity";

export class CrosswordTopicError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

async function getAllCrosswordTopics() {
    try {
        const client = AppDataSource;

        const crosswordTopics = await client
            .createQueryBuilder(CrosswordTopics, "ct")
            .select([
                "ct.crossword_topic_id",
                "t.topic_name"
            ])
            .leftJoin("ct.topics", "t")
            .getMany();

        return crosswordTopics;
    } catch (err) {
        throw new CrosswordTopicError(`Error in getting crossword topics: ${err}`, 500);
    }
}

async function getCrosswordTopicByName(name: string) {
    try {
        const client = AppDataSource;

        const crosswordTopics = await client
            .createQueryBuilder(CrosswordTopics, "ct")
            .leftJoinAndSelect("ct.topics", "t")
            .select([
                "ct.crossword_topic_id",
                "t.topic_name"
            ])
            .where("unaccent(Lower(t.topic_name)) ILike :name", { name: `%${name.toLowerCase()}%` });

        return await crosswordTopics.getMany();;
    } catch (err) {
        throw new CrosswordTopicError(`Error in getting crossword topics by name: ${err}`, 500);
    }
}

async function getCrosswordTopicById(id: number) {
    try {
        const client = AppDataSource;

        const crosswordTopic = await client
            .createQueryBuilder(CrosswordTopics, "ct")
            .select([
                "ct.crossword_topic_id",
                "t.topic_name"
            ])
            .leftJoin("ct.topics", "t")
            .where("ct.crossword_topic_id = :id", { id })
            .getMany();

        return crosswordTopic;
    } catch (err) {
        if (err instanceof CrosswordTopicError) {
            throw new CrosswordTopicError(`Error in getting crossword topic by ID: ${err}`, 500);
        }
        throw new Error(`Unhandled error ${err}`,)
    }
}

export class LanguageError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class TopicError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

interface CreateBody {
    language: string;
    crosswordTitle: string;
    topicName: string;
    difficulty: string;
}

const createCrosswordService = async (data: CreateBody) => {
    const language = await AppDataSource.getRepository(Languages).findOneBy({
        language_name: data.language
    });

    if (!language) {
        throw new LanguageError("Unknown language please provide different language", 200)
    }

    try {
        const topicRepository = AppDataSource.getRepository(Topics);

        const existingTopic = await topicRepository.findOneBy({ topic_name: data.topicName });
        if (existingTopic) {
            throw new TopicError("Topic is already defined", 200);
        }

        const crosswordRepository = AppDataSource.getRepository(Crosswords);

        const crosswordTopicRepository = AppDataSource.getRepository(CrosswordTopics);

        const topic = topicRepository.create({
            topic_name: data.topicName,
            language_id: language.language_id,
        });
        await topicRepository.save(topic);

        const crossword = crosswordRepository.create({
            title: data.crosswordTitle,
            language_id: language.language_id,
            difficulty: data.difficulty,
        });

        const savedCrossword = await crosswordRepository.save(crossword);

        const crosswordTopic = crosswordTopicRepository.create({
            crossword_id: savedCrossword.crossword_id,
            topic_id: topic.topic_id,
        });

        return await crosswordTopicRepository.save(crosswordTopic);

    } catch (err) {
        if (err instanceof CrosswordTopicError) {
            throw new CrosswordTopicError(`Error in getting crossword topic by ID: ${err}`, 500);
        }
        console.log(err)
        throw new Error(`Unhandled error ${err}`)
    }
};

export {
    getAllCrosswordTopics, getCrosswordTopicById,
    getCrosswordTopicByName, createCrosswordService as createCrosswordTopicService
};