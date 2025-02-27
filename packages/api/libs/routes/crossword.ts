import express from "express";
import { authMiddleware } from "../auth/authMiddleware";
import {
	createNewCrossword,
	deleteUserCrossword,
	getCrossword,
	updateUserCrossword,
} from "../controller/crossword";

const crosswordRouter = express.Router();

crosswordRouter.get("/", getCrossword);
crosswordRouter.get("/:id", getCrossword);
crosswordRouter.get("/search", getCrossword);
crosswordRouter.post("/", authMiddleware, createNewCrossword);
crosswordRouter.put("/", authMiddleware, updateUserCrossword);
crosswordRouter.delete("/", authMiddleware, deleteUserCrossword);

export default crosswordRouter;
