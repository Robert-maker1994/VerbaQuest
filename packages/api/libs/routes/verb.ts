import { Router, type Response, type NextFunction } from "express";
import type { AuthRequest } from "../types/questRequest";
import { AppDataSource } from "../../datasource";
import { Verb, Conjugation } from "../entity";
import type { LanguageCode } from "@verbaquest/types";
import { VerbError } from "../errors/verbError";

const verbRouter = Router();

/**
 * @description Get all verbs for a specific language.
 * @route GET /
 * @param {AuthRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
verbRouter.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const verb = await verbService.getAll(req.user.preferred_language);
        if (!verb) {
            throw new VerbError("User not found", 404);
        }
        res.json(verb)
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
 * @returns {Promise<void>}
 */
verbRouter.get("/conjugation/:verbId", async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const {  verbId } = req.params;
        console.log("helloo", verbId, req.params)
        const conjugation = await verbService.getConjugationById(Number(verbId));

        if (!conjugation) {
            throw new VerbError("Conjugation not found", 404);
        }

        res.json(conjugation);
    } catch (err) {
        next(err);
    }
});

const verbService = {
    /**
     * @description Get all verbs for a specific language.
     * @param {LanguageCode} language_code - The language code.
     * @returns {Promise<Verb[]>}
     */
    async getAll(language_code: LanguageCode) {
        const verbs = AppDataSource.getRepository(Verb);

        return verbs.find({
            relations: {
                word: true,
                language: true
            },
            where: {
                language: {
                    language_code
                }
            },
            select: {
                verb_id: true,
                word: {
                    word_id: true,
                    word_text: true
                },
                irregular: true,
                language: {
                    language_code: true
                }
            }
        });

    },
    /**
     * @description Get a specific conjugation by verbId and conjugationId.
     * @param {number} verbId - The ID of the verb.
     * @returns {Promise<Conjugation | null>}
     */
    async getConjugationById(verbId: number): Promise<Conjugation[] | null> {
        const conjugationRepository = AppDataSource.getRepository(Conjugation);

        const conjugation = await conjugationRepository.find({
            where: {
                verb: {
                    verb_id: verbId
                }
            },
            relations: {
                verb: true,
                tense: true,
                form: true
            },
            select: {
                id: true,
                conjugation: true,
                is_irregular: true,
                verb: {
                    verb_id: true
                },
                tense: {
                    tense_id: true,
                    tense: true,
                    mood: true
                },
                form: {
                    form: true,
                    form_id: true
                }
            }
        });

        return conjugation;
    }

}

export default verbRouter;
