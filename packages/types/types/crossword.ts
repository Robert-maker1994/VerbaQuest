/**
 * @module @verbaquest/types/crossword
 * @description This module provides type definitions related to crossword puzzles.
 */

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
 * Data for updating an existing crossword puzzle.
 * @interface UpdateCrosswordBody
 * @property {string} [title] - Optional new title for the crossword.
 * @property {string} [topic] - Optional new topic for the crossword.
 * @property {number} [topic_id] - Optional new topic ID for the crossword.
 * @property {string[]} [words] - Optional array of words for the crossword.
 * @property {string} grid_state - The updated grid state as a string.
 * @property {string} id - The ID of the crossword to update.
 * @property {boolean} [completed] - Optional flag indicating if the crossword is completed.
 */
export interface UpdateCrosswordBody {
    title?: string;
    topic?: string;
    topic_id?: number;
    words?: string[];
    grid_state: string;
    id: string;
    completed?: boolean;
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
 * Data for creating a user's crossword entry.
 * @interface createUserCrosswordBody
 * @property {number} crossword_id - The ID of the crossword.
 * @property {boolean} completed - Whether the crossword is completed.
 * @property {string} grid_state - The state of the crossword grid.
 */
export interface createUserCrosswordBody {
    crossword_id: number;
    completed: boolean;
    grid_state: string;
}

/**
 * Represents a crossword topic.
 * @interface Topic
 * @property {string} topic_name - The name of the topic.
 * @property {number} topic_id - The ID of the topic.
 * @property {object} language - Language information.
 * @property {string} language.language_code - The language code.
 */
export interface Topic {
    topic_name: string;
    topic_id: number;
    language: {
        language_code: string;
    };
}

/**
 * Represents the difficulty levels of a crossword.
 * @enum {string}
 * @property {"a1"} A1 - Beginner level.
 * @property {"a2"} A2 - Elementary level.
 * @property {"b1"} B1 - Intermediate level.
 * @property {"b2"} B2 - Upper-intermediate level.
 * @property {"c1"} C1 - Advanced level.
 * @property {"c2"} C2 - Proficiency level.
 */
export enum Difficulty {
    A1 = "a1",
    A2 = "a2",
    B1 = "b1",
    B2 = "b2",
    C1 = "c1",
    C2 = "c2",
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
