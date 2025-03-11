type Direction = "horizontal" | "vertical";


export interface WordData {
	word_id: string;
	word: string;
	start_row: number;
	start_col: number;
	definition: string;
	direction: Direction;
}
