import { type NextFunction, type Response, Router } from "express";
import { AppDataSource } from "../../datasource";
import { Form, Tense } from "../entity";
import { VerbError } from "../errors/verbError";
import { verbService } from "../services";
import type { AuthRequest } from "../types/authRequest";

const verbRouter = Router();

/**
 * @description Get all verbs for a specific language.
 * @route GET /
 * @param {AuthRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Response<Verb[]>}
 */
verbRouter.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.query.ids) {
      const ids = (req.query.ids as string).split(",");
      const verbs = await verbService.getById(ids.map(Number));

      if (!verbs) {
        throw new VerbError("No verbs found", 204);
      }

      res.json(verbs);
    }
    const verb = await verbService.getAll(req.user.preferred_language);

    if (!verb) {
      throw new VerbError("No verbs found", 204);
    }

    res.json(verb);
  } catch (err) {
    next(err);
  }
});

/**
 * @description
 * @route GET /:search
 * @param {AuthRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Response<Verb[]>}
 */
verbRouter.get("/:search", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { search } = req.params;
    if (!search) {
      throw new VerbError("INVALID_PARAMS", 400);
    }
    const verb = await verbService.search(search, req.user.preferred_language);

    if (!verb) {
      throw new VerbError("No verbs found", 204);
    }

    res.json(verb);
  } catch (err) {
    next(err);
  }
});

/**
 * @description Get a specific conjugation for a verb.
 * @route GET /verb/:verbId/conjugation/:conjugationId
 * @param {AuthRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Response<Conjugation[]>}
 */
verbRouter.get("/conjugation/:verbId", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { verbId } = req.params;
    const conjugation = await verbService.getConjugationById(Number(verbId), req.user.app_language);
    const tenses = await AppDataSource.getRepository(Tense).find({
      where: {
        language: {
          language_code: req.user.preferred_language,
        },
      },
    });
    const verb = await verbService.getById([Number(verbId)]);

    const forms = await AppDataSource.getRepository(Form).find({
      where: {
        language: {
          language_code: req.user.preferred_language,
        },
      },
    });

    if (!conjugation) {
      throw new VerbError("Conjugation not found", 404);
    }

    res.json({
      conjugation,
      tenses,
      forms,
      verb,
    });
  } catch (err) {
    next(err);
  }
});

export default verbRouter;
