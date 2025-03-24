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
			const { userId, preferred_language } = req.user;

			const search = req?.query.search as string | undefined;
			const page = req?.query.page as string | undefined;
			const [crosswords, totalCount] = await crosswordService.getCrosswordDetails(
				userId,
				preferred_language,
				search,
				page ? Number.parseInt(page) : undefined
			);

			res.json({
				crosswords,
				totalCount,
				currentPage: page,
				pageSize: 10,
				totalPages: Math.ceil(totalCount / 10),
			});
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
