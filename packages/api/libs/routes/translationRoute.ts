import express, { type NextFunction, type Response } from "express";
import translationService from "../services/translationService";
import type { AuthRequest } from "../types/authRequest";

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
