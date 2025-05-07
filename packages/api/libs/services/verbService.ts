import type { LanguageCode } from "@verbaquest/types";
import { In, Like } from "typeorm";
import { AppDataSource } from "../../datasource";
import { Conjugation, Verb } from "../entity";
import { VerbError } from "../errors/verbError";

export const verbService = {
  /**
   * @description Get all verbs for a specific language.
   * @param {number[]} verb_id - The language code.
   * @returns {Promise<Verb[]>}
   */
  async getById(verb_id: number[]): Promise<Verb> {
    const verbs = AppDataSource.getRepository(Verb);

    return verbs.findOne({
      where: {
        verb_id: In(verb_id),
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
    });
  },
  /**
   * @description Get all verbs for a specific language.
   * @param {string} search - The search string
   * @param {LanguageCode} language_code - query language
   * @returns {Promise<Verb[]>}
   */
  async search(search: string, language_code: LanguageCode): Promise<Verb[]> {
    const verbs = AppDataSource.getRepository(Verb);

    return verbs.find({
      where: {
        word: {
          word_text: Like(`%${search}%`),
        },
        language: {
          language_code,
        },
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
    });
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
  async getConjugationById(verbId: number): Promise<Conjugation[] | null> {
    const conjugationRepository = AppDataSource.getRepository(Conjugation);

    const conjugation = await conjugationRepository.find({
      where: {
        verb: {
          verb_id: verbId,
        },
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

        form: {
          form: true,
          form_id: true,
        },
      },
    });

    if (!conjugation.length) {
      throw new VerbError("Conjugation not found", 404);
    }

    return conjugation;
  },
};
