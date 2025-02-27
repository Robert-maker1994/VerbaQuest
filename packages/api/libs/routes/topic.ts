import express from "express";
import { authMiddleware } from "../auth/authMiddleware";
import {
	createTopicController,
	getTopicsController,
} from "../controller/topic";

const topicRouter = express.Router();

topicRouter.get("/", getTopicsController);
topicRouter.post("/", authMiddleware, createTopicController);

export default topicRouter;
