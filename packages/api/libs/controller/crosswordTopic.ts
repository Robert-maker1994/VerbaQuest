import type { Request, Response } from "express";
import {
	CrosswordTopicError,
	LanguageError,
	createCrosswordTopicService,
	getAllCrosswordTopics,
	getCrosswordTopicById,
	getCrosswordTopicByName,
} from "../services/crosswordTopic";

export const getCrosswordTopic = async (req: Request, res: Response) => {
	try {
		const { id, name } = req.query;

		if (id) {
			const crosswordTopic = await getCrosswordTopicById(Number(id));
			res.status(200).json(crosswordTopic);
			return;
		}

		if (name) {
			const crosswordTopics = await getCrosswordTopicByName(name as string);
			res.status(200).json(crosswordTopics);
			return;
		}

		const crosswordTopics = await getAllCrosswordTopics();

		res.status(200).json(crosswordTopics);
	} catch (err) {
		if (err instanceof CrosswordTopicError) {
			res.status(err.statusCode).json({ message: err.message });
		}
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const createCrosswordTopic = async (req: Request, res: Response) => {
	try {
		if (!req.body) {
			res.status(200).json({
				message: "No data was provided",
			});
		}

		const newTopic = await createCrosswordTopicService(req.body);
		res.status(201).json(newTopic);
	} catch (err) {
		if (err instanceof CrosswordTopicError) {
			res.status(err.statusCode).json({ message: err.message });
		}
		if (err instanceof LanguageError) {
			res.status(err.statusCode).json({ message: err.message });
		} else {
			console.error(err);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
};
