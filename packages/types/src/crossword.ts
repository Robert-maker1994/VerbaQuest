/**
 * @module @verbaquest/types/crossword
 * @description This module provides type definitions related to crossword puzzles.
 */

import type { Difficulty } from "./difficulty";
import type { LanguageName } from "./language";

/**
 * Represents the direction of a word in a crossword puzzle.
 * @typedef {"horizontal" | "vertical"} Direction
 */
type Direction = "horizontal" | "vertical";

/**
 * Represents data for a single word in a crossword puzzle.
 * @interface WordData
 * @property {number} word_id - Unique identifier for the word.
 * @property {string} word - The word itself.
 * @property {number} start_row - Row index (0-based) where the word starts.
 * @property {number} start_col - Column index (0-based) where the word starts.
 * @property {string} definition - The word translated in the app language
 * @property {string} clue - The clue in the normal language
 * @property {Direction} direction - The direction of the word ("horizontal" or "vertical").
 */
export interface WordData {
  word_id: number;
  word: string;
  start_row: number;
  start_col: number;
  clue: string;
  definition: string;
  direction: Direction;
}

/**
 * Data for creating a new crossword puzzle.
 * @interface CreateCrosswordBody
 * @property {string} title - The title of the crossword.
 * @property {string} topic - The topic of the crossword.
 * @property {string[]} words - An array of words for the crossword.
 * @property {LanguageName} language - The language of the crossword.
 * @property {number} userId - The ID of the user creating the crossword.
 */
export interface CreateCrosswordBody {
  title: string;
  topic: string;
  words: string[];
  language: LanguageName;
  userId: number;
}

/**
 * Data for a user's crossword attempts.
 * @interface GetUserCrosswords
 * @property {boolean} completed - Whether the crossword is completed.
 * @property {number} completion_timer - Completion time in seconds.
 * @property {Date} last_attempted - The date and time of the last attempt.
 * @property {object} crossword - Crossword details.
 * @property {number} crossword.crossword_id - The ID of the crossword.
 * @property {string} crossword.title - The title of the crossword.
 * @property {string} crossword.difficulty - The difficulty of the crossword.
 * @property {object[]} crossword.topics - An array of topic objects.
 * @property {number} crossword.topics.topic_id - The ID of the topic.
 * @property {string} crossword.topics.topic_name - The name of the topic.
 */
export interface GetUserCrosswords {
  completed: boolean;
  completion_timer: number;
  last_attempted: Date;
  crossword: {
    crossword_id: number;
    title: string;
    difficulty: string;
    topics: {
      topic_id: number;
      topic_name: string;
    }[];
  };
}

/**
 * Response containing details of multiple crosswords.
 * @interface CrosswordDetailsResponse
 * @property {CrosswordDetails[]} crosswords - An array of crossword details.
 * @property {number} totalCount - The total number of crosswords.
 * @property {number} currentPage - The current page number.
 * @property {number} pageSize - The number of crosswords per page.
 * @property {number} totalPages - The total number of pages.
 */
export interface CrosswordDetailsResponse {
  crosswords: CrosswordDetails[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Details of a single crossword puzzle.
 * @interface CrosswordDetails
 * @property {string} title - The title of the crossword.
 * @property {number} crossword_id - The ID of the crossword.
 * @property {boolean} is_Public - Whether the crossword is public.
 * @property {Difficulty} difficulty - The difficulty of the crossword.
 * @property {object[]} topics - An array of topic objects.
 * @property {string} topics.topic_name - The name of the topic.
 * @property {number} topics.topic_id - The ID of the topic.
 * @property {object} topics.language - Language information.
 * @property {string} topics.language.language_code - The language code.
 * @property {object[]} userCrosswords - An array of user crossword attempts.
 * @property {boolean} userCrosswords.completed - Whether the attempt is completed.
 * @property {number} userCrosswords.completion_timer - Completion time in seconds.
 * @property {number} userCrosswords.user_crossword_id - The ID of the user's crossword attempt.
 */
export interface CrosswordDetails {
  title: string;
  crossword_id: number;
  is_Public: boolean;
  difficulty: Difficulty;
  topics: {
    topic_name: string;
    topic_id: number;
    language: {
      language_code: string;
    };
  }[];
  userCrosswords: {
    completed: boolean;
    completion_timer: number;
    user_crossword_id: number;
    is_favorite: boolean;
  }[];
}

/**
 * Represents the response for a crossword puzzle.
 * @interface CrosswordResponse
 * @property {string[][]} crossword - A 2D array representing the crossword grid.
 * @property {string} title - The title of the crossword.
 * @property {boolean} isComplete - Whether the crossword is completed.
 * @property {WordData[]} metadata - Metadata about the words in the crossword.
 * @property {number} id - The ID of the crossword.
 */
export interface CrosswordResponse {
  crossword: string[][];
  title: string;
  isComplete: boolean;
  metadata: WordData[];
  id: number;
}
