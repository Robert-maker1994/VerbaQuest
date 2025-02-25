import express from "express";
import { getCrossword } from "../controller/crossword";

const crosswordRouter = express.Router();

crosswordRouter.get("/",getCrossword);
crosswordRouter.get("/:id", getCrossword);
crosswordRouter.get("/search", getCrossword);

export default crosswordRouter;
