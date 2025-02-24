import express from "express";
import { getCrosswordTopic, createCrosswordTopic } from "../controller/crosswordTopic";

const crosswordTopicRouter = express.Router();


// Get all crossword topics
crosswordTopicRouter.get("/", getCrosswordTopic);

// Create a new crossword topic
crosswordTopicRouter.post("/", createCrosswordTopic);

// Update an existing crossword topic
// crosswordTopicRouter.put("/:id", updateCrosswordTopic);

// Delete a crossword topic
// crosswordTopicRouter.delete("/:id", deleteCrosswordTopic);


export default crosswordTopicRouter;
