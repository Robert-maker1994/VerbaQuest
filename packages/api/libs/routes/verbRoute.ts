import axios from "axios";
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
    const conjugation = await verbService.getConjugationById(Number(verbId));
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

    // create a translation object
    const getTranslations = conjugation.map(async (conj) => {
      const string = `${conj.form.form} ${conj.tense.tense}`;
      const res = await axios.post<{ translatedText: string }>(
        "http://localhost:5000/translate",
        {
          q: string,
          source: "auto",
          target: req.user.preferred_language,
          format: "text",
          caches: true,
          alternatives: 1,
          api_key: "",
        },
        { headers: { "Content-Type": "application/json" } },
      );
      return {
        ...conj,
        directTranslation: res.data.translatedText ? res.data.translatedText : conj.conjugation,
      };
    });

    res.json({
      conjugation: Promise.all(getTranslations),
      tenses,
      forms,
      verb,
    });
  } catch (err) {
    next(err);
  }
});

export default verbRouter;
