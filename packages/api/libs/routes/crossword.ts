import express, { type Response, type NextFunction } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import {
	createNewCrossword,
	deleteUserCrossword,
	getCrosswordById,
	updateUserCrossword,
} from "../controller/crossword";
import crosswordService from "../services/crosswordService";
import type { AuthRequest } from "../types/questRequest";

const crosswordRouter = express.Router();
crosswordRouter.get(
	"/details",
	authMiddleware,
	async (req: AuthRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req.user.userId;
			const crosswordDetails = await crosswordService.getCrosswordDetails(
				userId,
				req?.query.search as string,
			);

			res.send(crosswordDetails);
		} catch (err) {
			next(err);
		}
	},
);

crosswordRouter.get("/:id", authMiddleware, getCrosswordById);
crosswordRouter.post("/", authMiddleware, createNewCrossword);
crosswordRouter.put("/", authMiddleware, updateUserCrossword);
crosswordRouter.delete("/", authMiddleware, deleteUserCrossword);

export default crosswordRouter;
