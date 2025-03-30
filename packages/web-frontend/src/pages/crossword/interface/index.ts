import type { WordData } from "@verbaquest/types";
import type { RefObject } from "react";

/**
 * Interface defining the data for a single cell in the crossword grid.
 */
export interface CellData {
	/**
	 * The letter (or empty string) in the cell.
	 */
	value: string;
	/**
	 * The state of the cell (Correct, Incorrect, Empty, Partial).
	 */
	state: CellState;
	/**
	 * An array of word IDs that this cell belongs to.
	 */
	wordId: number[];
}

/**
 * Enum defining the possible states of a crossword cell.
 */
export enum CellState {
	Correct = 0,
	Incorrect = 1,
	Empty = 2,
	Partial = 3,
	OutOfBounds = 4,
}

/**
 * Interface defining the input properties for the `useCrosswordGrid` hook.
 */
export interface UseCrosswordGridProps {
	/**
	 * A 2D array representing the crossword grid. '#' represents blocked cells.  Example: `[['A', 'B'], ['C', '#']]`
	 */
	crosswordGrid: string[][];
	/**
	 * An array of WordData objects, each describing a word in the crossword.
	 */
	metadata: WordData[];
}

export interface UseCrosswordGridReturn {
	/**
	 * A Map storing the data for each cell in the crossword grid.  Keyed by "row-col" (e.g., "0-0").
	 */
	cellData: Map<string, CellData>;
	/**
	 * The currently selected WordData object (or null if no word is selected).
	 */
	selectedWord: WordData | null;
	/**
	 * An array of word IDs representing the completed words in the puzzle.
	 */
	completedWords: number[];
	/**
	 * An object containing references to the input elements for each cell.  Used for focusing.
	 */
	inputRefs: RefObject<{ [key: string]: HTMLInputElement | null }>;
	/**
	 * A reference to the clue list element (for scrolling).
	 */
	clueListRef: React.RefObject<HTMLDivElement | null>;
	/**
	 * Function to handle a clue click.  Updates the selected word.
	 * @param {WordData} word - The word data for the clicked clue.
	 */
	onCellSelect: (row: number, col: number) => void;
	/**
	 * Function to handle keyboard input or click in a cell.  Manages navigation and updates cell state.
	 * @param {number} row - The row index of the cell.
	 * @param {number} col - The column index of the cell.
	 * @param {React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>} event - The keyboard event.
	 */
	manageCellNavigation: (
		row: number,
		col: number,
		event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
}
