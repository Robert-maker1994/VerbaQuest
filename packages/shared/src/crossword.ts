import type { LanguageName } from "./language";

type Direction = "horizontal" | "vertical";

export interface WordData {
	word_id: number;
	word: string;
	start_row: number;
	start_col: number;
	definition: string;
	direction: Direction;
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
	};
}

export enum Difficulty {
	A1 = "a1",
	A2 = "a2",
	B1 = "b1",
	B2 = "b2",
	C1 = "c1",
	C2 = "c2",
}

export interface GetUserCrosswords {
	completed: boolean,
	completion_timer: number,
	last_attempted: Date,
	crossword: {
		crossword_id: number,
		title: string,
		difficulty: string,
		topics: {
			topic_id: number,
			topic_name: string,
		}[]
	}
}

export interface CrosswordDetailsResponse {
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


export interface CrosswordResponse {
	crossword: string[][];
	title: string;
	isComplete: boolean;
	metadata: WordData[];
	id: number;
}
