import express from "express";
import { getCrossword } from "../controller/crossword";

const crosswordRouter = express.Router();

crosswordRouter.get("/", getCrossword);
// crosswordRouter.post('/', createCrossword);
// crosswordRouter.put('/', updateCrossword);
// crosswordRouter.delete('/', deleteCrossword);

export default crosswordRouter;
