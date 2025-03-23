import express, { type NextFunction, type Response } from "express";
import type { AuthRequest } from "../types/questRequest";
import translationService from "../services/translationService";

const translationRouter = express.Router();

translationRouter.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const translation = await translationService.getTranslations(req.user.app_language);
        res.send(translation);
    } catch (error) {
        next(error);
    }
});

export default translationRouter;
