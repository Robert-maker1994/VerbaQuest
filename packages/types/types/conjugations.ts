import type { LanguageCode } from "./language";

/**
 * @interface Conjugation
 * @description Represents a conjugated form of a verb.
 */
export interface Conjugation {
  /**
   * @property {string} conjugation - The conjugated form of the verb (e.g., "hablo", "comes").
   */
  conjugation: string;
  /**
   * @property {object} tense - Information about the tense of the conjugation.
   * @property {string} tense.tense - The name of the tense (e.g., "Presente", "Pretérito").
   * @property {string} tense.mood - The mood of the tense (e.g., "indicativo", "subjuntivo").
   */
  tense: {
    tense: string;
    mood: string;
  };
  /**
   * @property {object} form - Information about the grammatical form of the conjugation.
   * @property {string} form.form - The grammatical form (e.g., "yo", "tú", "él/ella/usted").
   */
  form: {
    form: string;
  };
  translations: {
    translation: string;
    language: {
      language_code: LanguageCode;
    };
  }[];
  /**
   * @property {object[]} sentences - An array of sentences.
   * @property {string} sentences.sentence - The sentence.
   * @property {object} sentences.language - The language of the sentence.
   * @property {LanguageCode} sentences.language.language_code - The language code of the sentence.
   */
  sentences: {
    sentence: string;
    language: {
      language_code: LanguageCode;
    };
  }[];
}
