import { getCrossword } from "../controller/crossword";
import express from "express"

const crosswordRouter = express.Router();

crosswordRouter.get('/', getCrossword);
// crosswordRouter.post('/', createCrossword);
// crosswordRouter.put('/', updateCrossword);
// crosswordRouter.delete('/', deleteCrossword);

export default crosswordRouter;
 