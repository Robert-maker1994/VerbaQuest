export interface WordData {
	word: string;
	start_row: number;
	start_col: number;
	definition: string;
	direction: "horizontal" | "vertical";
}
