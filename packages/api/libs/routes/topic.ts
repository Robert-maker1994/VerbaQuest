import express from "express";
import { getTopicsController, createTopicController } from "../controller/topic";
import { authMiddleware } from "../auth/authMiddleware";

const topicRouter = express.Router();

topicRouter.get("/", getTopicsController);
topicRouter.post("/", authMiddleware, createTopicController);

export default topicRouter;