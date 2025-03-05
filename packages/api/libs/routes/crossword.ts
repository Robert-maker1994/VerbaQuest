import express from "express";
import { authMiddleware } from "../auth/authMiddleware";
import {
	createNewCrossword,
	deleteUserCrossword,
	getCrosswordDetails,
	getRandomCrossword,
	updateUserCrossword,
} from "../controller/crossword";

const crosswordRouter = express.Router();
// TODO handle getCrossword only getting ispublic
crosswordRouter.get("/", getCrosswordDetails);
crosswordRouter.get("/today", getRandomCrossword);
// crosswordRouter.get("/:id", getCrossword);
// crosswordRouter.get("/search", getCrossword);
crosswordRouter.post("/", authMiddleware, createNewCrossword);
crosswordRouter.put("/", authMiddleware, updateUserCrossword);
crosswordRouter.delete("/", authMiddleware, deleteUserCrossword);

export default crosswordRouter;
