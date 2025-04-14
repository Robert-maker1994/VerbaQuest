import type { LanguageCode } from "./language";

/**
 * @interface GetAllVerbResponse
 * @description Interface for the response of the getAll verb route.
 */
export interface GetAllVerbResponse {
  verb_id: number;

  /**
   * @property {object} word - The word object.
   * @property {number} word.word_id - The id of the word.
   * @property {string} word.word_text - The text of the word.
   */
  word: {
    word_id: number;
    word_text: string;
  };
  /**
   * @property {boolean} irregular - Indicates if the verb is irregular.
   */
  irregular: boolean;
  /**
   * @property {object} language - The language object.
   * @property {LanguageCode} language.language_code - The language code.
   */
  language: {
    language_code: LanguageCode;
  };
}
