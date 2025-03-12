import express from "express";
import { authMiddleware } from "../auth/authMiddleware";
import {
	createNewCrossword,
	deleteUserCrossword,
	getCrosswordDetails,
	getCrosswordById,
	getRandomCrossword,
	updateUserCrossword,
} from "../controller/crossword";

const crosswordRouter = express.Router();
crosswordRouter.get("/details", getCrosswordDetails);
crosswordRouter.get("/:id", getCrosswordById);
crosswordRouter.get("/today", getRandomCrossword);
crosswordRouter.post("/", authMiddleware, createNewCrossword);
crosswordRouter.put("/", authMiddleware, updateUserCrossword);
crosswordRouter.delete("/", authMiddleware, deleteUserCrossword);

export default crosswordRouter;
