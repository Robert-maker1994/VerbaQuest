import type { LanguageName } from "./user";

type Direction = "horizontal" | "vertical";

export interface WordData {
	word_id: string;
	word: string;
	start_row: number;
	start_col: number;
	definition: string;
	direction: Direction;
}

export interface CrosswordResponse {
	crossword: string[][];
	title: string;
	metadata: WordData[];
	id: number;
}

export interface UpdateCrosswordBody {
	title?: string;
	topic?: string;
	topic_id?: number;
	words?: string[];
	grid_state: string;
	id: string;
	completed?: boolean;
}

export interface CreateCrosswordBody {
	title: string;
	topic: string;
	words: string[];
	language: LanguageName;
	userId: number;
}
 
export interface createUserCrosswordBody {
	crossword_id: number;
	completed: boolean;
	grid_state: string;
} 


export interface Topic {
    topic_name: string;
    topic_id: number;
    language: {
        language_code: string;
    }
}

export interface CrosswordDetails {
    title: string;
    crossword_id: number;
    is_Public: boolean;
    difficulty: number;
    topics: Topic[];

}

export interface CrosswordResponse {
    crossword: string[][];
    title: string;
    isComplete: boolean;
    metadata: WordData[];
    id: number;
}
