import type { LanguageCode } from "@verbaquest/types";
import { type NextFunction, type Response, Router } from "express";
import { AppDataSource } from "../../datasource";
import { Conjugation, Form, Tense, Verb } from "../entity";
import { VerbError } from "../errors/verbError";
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
    const verb = await verbService.getById(Number(verbId));

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
      verb
    });
  } catch (err) {
    next(err);
  }
});

const verbService = {
  /**
  * @description Get all verbs for a specific language.
  * @param {number} verb_id - The language code.
  * @returns {Promise<Verb[]>}
  */
  async getById(verb_id: number): Promise<Verb> {
    const verbs = AppDataSource.getRepository(Verb);

    return verbs.findOne({
        where: {
            verb_id,
        },
        relations: {
            word: true,
            language: true,
        },
        select: {
            verb_id: true,
            word: {
                word_id: true,
                word_text: true,
            },
            irregular: true,

        },
    
    })

  
},
  /**
   * @description Get all verbs for a specific language.
   * @param {LanguageCode} language_code - The language code.
   * @returns {Promise<Verb[]>}
   */
  async getAll(language_code: LanguageCode): Promise<Verb[]> {
    const verbs = AppDataSource.getRepository(Verb);

    return verbs.find({
      relations: {
        word: true,
        language: true,
      },
      where: {
        language: {
          language_code,
        },
      },
      select: {
        verb_id: true,
        word: {
          word_id: true,
          word_text: true,
        },
        irregular: true,
        language: {
          language_code: true,
        },
      },
    });
  },
    /**
     * @description Get a specific conjugation by verbId and conjugationId.
     * @param {number} verbId - The ID of the verb.
     * @returns {Promise<Conjugation | null>}
     */
    async getConjugationById(verbId: number, languageCode: LanguageCode): Promise < Conjugation[] | null > {
      const conjugationRepository = AppDataSource.getRepository(Conjugation);

      const conjugation = await conjugationRepository.find({
        where: {
          verb: {
            verb_id: verbId,
          },
          translations: {
            language: {
              language_code: languageCode,
            },

          }

        },
        relations: {
          verb: true,
          tense: true,
          form: true,
          translations: true,
        },
        select: {
          id: true,
          conjugation: true,
          is_irregular: true,
          tense: {
            tense_id: true,
            tense: true,
            mood: true,
          },
          translations: {
            conjugationTranslationId: true,

            translation: true,
          },
          form: {
            form: true,
            form_id: true,
          },
        },
      });

      return conjugation;
    },
};

export default verbRouter;
