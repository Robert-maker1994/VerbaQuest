import type { Request, Response, NextFunction } from "express";
import { getTopics, createTopic } from "../services/topic";

export const getTopicsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const topics = await getTopics();
        res.status(200).json(topics);
    } catch (err) {
        next(err);
    }
};

export const createTopicController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const topic = await createTopic(req.body);
        res.status(201).json(topic);
    } catch (err) {
        next(err);
    }
};