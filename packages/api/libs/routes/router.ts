import core from "express"
import crosswordRouter from "./crossword";
import crosswordTopicRouter from "./crosswordTopic";

export default function initializeRoutes(app: core.Express ) {
    app.use("/crossword", crosswordRouter);
    app.use("/crosswordTopic", crosswordTopicRouter);

}