import type { CrosswordResponse, LanguageCode } from "@verbaquest/types";
import axios from "axios";
import type { Crossword } from "../libs/entity";
import { CrosswordError } from "../libs/errors";
import type { CrosswordGrid, CrosswordMetadata } from "./generateCrossword";

/**
 * @async
 * @function matchCrosswordsForMetadata
 * @description Matches crossword words with their metadata, fetches translations, and formats the data for the API response.
 * @param {Crossword} crossword - The crossword entity from the database.
 * @param {CrosswordMetadata} metadata - The metadata generated for the crossword grid.
 * @param {CrosswordGrid} grid - The generated crossword grid.
 * @param {LanguageCode} targetLanguage - The target language for translations.
 * @returns {Promise<CrosswordResponse>} A promise that resolves to a formatted CrosswordResponse object.
 * @throws {CrosswordError} Throws an error if there are issues with the crossword data or the translation process.
 */
async function matchCrosswordsForMetadata(
  crossword: Crossword,
  metadata: CrosswordMetadata,
  grid: CrosswordGrid,
  targetLanguage: LanguageCode,
): Promise<CrosswordResponse> {
  const data = metadata.words_data.map(async (data) => {
    const matchedWord = crossword.crosswordWords.find((word) => word.words.word_text === data.word);

    if (!matchedWord.words) {
      console.info("No matched error generating metadata object");
      throw new CrosswordError("No words provided", 204);
    }

    try {
      const res = await axios.post<{ translatedText: string }>(
        "http://localhost:5000/translate",
        {
          q: matchedWord.words.word_text,
          source: "auto",
          target: targetLanguage,
          format: "text",
          alternatives: 1,
          api_key: "",
        },
        { headers: { "Content-Type": "application/json" } },
      );

      return {
        ...data,
        word_id: matchedWord.words.word_id,
        word: matchedWord.words.word_text,
        clue: matchedWord.clue,
        definition: res.data.translatedText ? res.data.translatedText : matchedWord.words.definition,
      };
    } catch (err) {
      console.info(err);
      throw new CrosswordError("Internal Error", 500);
    }
  });
  return {
    title: crossword?.title,
    isComplete: false,
    id: crossword.crossword_id,
    metadata: await Promise.all(data),
    crossword: grid,
  };
}

export default matchCrosswordsForMetadata;
