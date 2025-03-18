import type { WordData } from "@verbaquest/shared";
import {
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { type CellData, CellState } from "../interface";
import type {
	UseCrosswordGridProps,
	UseCrosswordGridReturn,
} from "../interface";

const isCellInWord = (
	cellRow: number,
	cellCol: number,
	word: WordData,
): boolean =>
	word.direction === "horizontal"
		? cellRow === word.start_row &&
		cellCol >= word.start_col &&
		cellCol < word.start_col + word.word.length
		: cellCol === word.start_col &&
		cellRow >= word.start_row &&
		cellRow < word.start_row + word.word.length;

/**
 * A custom React hook to manage the state and logic of a crossword puzzle.
 *
 * @param {UseCrosswordGridProps} props - The input properties for the hook.
 * @param {string[][]} props.crosswordGrid - A 2D array representing the crossword grid. '#' represents blocked cells.
 * @param {WordData[]} props.metadata - An array of WordData objects, each containing information about a word in the puzzle.
 * @returns {UseCrosswordGridReturn} An object containing the state and functions to interact with the crossword.
 */
export const useCrosswordGrid = ({
	crosswordGrid,
	metadata,
}: UseCrosswordGridProps): UseCrosswordGridReturn => {
	const [cellData, setCellData] = useState<Map<string, CellData>>(new Map());
	const [completedWords, setCompletedWords] = useState<number[]>([]);
	const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
	const inputRefs: RefObject<{ [key: string]: HTMLInputElement | null }> =
		useRef({});
	const clueListRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (crosswordGrid) {
			const newCellData = new Map<string, CellData>();
			for (let row = 0; row < crosswordGrid.length; row++) {
				for (let col = 0; col < crosswordGrid[row].length; col++) {
					const key = `${row}-${col}`;
					if (crosswordGrid[row][col] !== "#") {
						const wordId = metadata
							.filter((word) => isCellInWord(row, col, word))
							.map((word) => word.word_id);
						newCellData.set(key, { value: "", state: CellState.Empty, wordId });
					} else {
						newCellData.set(key, { value: "#", state: CellState.OutOfBounds, wordId: [-1] });
					}
				}
			}
			setCellData(newCellData);
		}
	}, [crosswordGrid, metadata]);

	useEffect(() => {
		const completed = metadata
			.filter((word) => {
				for (let i = 0; i < word.word.length; i++) {
					const row = word.start_row + (word.direction === "vertical" ? i : 0);
					const col =
						word.start_col + (word.direction === "horizontal" ? i : 0);
					const key = `${row}-${col}`;
					const cell = cellData.get(key);
					if (!cell) {
						return false;
					}
					if (
						cell.state === CellState.Empty ||
						cell.state === CellState.Incorrect
					) {
						return false;
					}
				}
				return true;
			})
			.map((word) => word.word_id);
		setCompletedWords(completed);
	}, [cellData, metadata]);

	const findAdjacentWord = useCallback(
		(
			currentWord: WordData,
			direction: "next" | "previous",
		): WordData | undefined => {
			const currentIndex = metadata.findIndex(
				(w) => w.word_id === currentWord.word_id,
			);

			if (currentIndex === -1) {
				return undefined;
			}

			const nextIndex =
				direction === "next" ? currentIndex + 1 : currentIndex - 1;

			if (nextIndex < 0 || nextIndex >= metadata.length) {
				return undefined;
			}

			setSelectedWord(metadata[nextIndex]);
			return metadata[nextIndex];
		},
		[metadata],
	);

	const onCellSelect = (row: number, col: number) => {
		const word = metadata.find((w) => {
			if (w.direction === "horizontal") {
				return (
					row === w.start_row &&
					col >= w.start_col &&
					col < w.start_col + w.word.length
				);
			}

			return (
				col === w.start_col &&
				row >= w.start_row &&
				row < w.start_row + w.word.length
			);
		});
		if (word) {
			setSelectedWord(word);
		}
	};

	const manageCellNavigation = (
		row: number,
		col: number,
		event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		event.preventDefault();
		const key = `${row}-${col}`;
		if (!event?.key) {
			return;
		}

		if (!selectedWord) return;

		const correctValue = crosswordGrid[row][col];
		const currentCellData = cellData.get(key);

		if (!currentCellData) {
			throw new Error("cell has no data");
		}
		let nextRow = row;
		let nextCol = col;
		switch (event.key) {
			case "ArrowUp":
				nextRow--;
				if (nextRow < 0) {
					return; // Prevent moving above the grid
				}
				onCellSelect(nextRow, nextCol);
				break;
			case "ArrowDown":
				nextRow++;
				if (nextRow >= crosswordGrid.length) {
					return; // Prevent moving below the grid
				}
				onCellSelect(nextRow, nextCol);

				break;
			case "ArrowLeft":
				nextCol--;
				if (nextCol < 0) {
					return; // Prevent moving to the left of the grid
				}
				onCellSelect(nextRow, nextCol);

				break;
			case "ArrowRight":
				nextCol++;
				if (nextCol >= crosswordGrid[0].length) {
					return; // Prevent moving to the right of the grid
				}
				onCellSelect(nextRow, nextCol);

				break;
			case "Backspace":
				if (currentCellData?.value !== "") {
					setCellData((prevCellData) => {
						const newCellData = new Map(prevCellData);

						newCellData.set(key, {
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							...newCellData.get(key)!,
							value: "",
							state: CellState.Empty,
						});
						return newCellData;
					});
				} else {
					if (selectedWord.direction === "horizontal") {
						nextCol--;

						if (nextCol < selectedWord.start_col) {
							const nextWord = findAdjacentWord(selectedWord, "previous");
							if (nextWord) {
								nextRow = nextWord.start_row;
								nextCol = nextWord.start_col + nextWord.word.length - 1;
							} else {
								return;
							}
						}
					} else {
						nextRow--;
						if (nextRow < selectedWord.start_row) {
							const nextWord = findAdjacentWord(selectedWord, "previous");
							if (nextWord) {
								nextRow = nextWord.start_row + nextWord.word.length - 1;
								nextCol = nextWord.start_col;
							} else {
								return;
							}
						}
					}
					handleInputFocus(nextRow, nextCol);
				}
				return;
			default:
				if (/^[a-zA-Z]$/.test(event.key)) {
					const value = event.key;

					setCellData((prevCellData) => {
						const newCellData = new Map(prevCellData);
						let newCellState = CellState.Incorrect;

						// This catches Ñ
						if (
							value.localeCompare(correctValue, "en", {
								sensitivity: "base",
							}) === 0
						) {
							newCellState = CellState.Partial;
						}

						if (value.toLowerCase() === correctValue.toLowerCase()) {
							newCellState = CellState.Correct;
						}

						newCellData.set(key, {
							...currentCellData,
							value,
							state: newCellState,
						});
						return newCellData;
					});

					if (
						value.localeCompare(correctValue, "en", {
							sensitivity: "base",
						}) === 0
					) {
						if (selectedWord.direction === "horizontal") {
							nextCol++;
							if (
								nextCol >=
								selectedWord.start_col + selectedWord.word.length
							) {
								const nextWord = findAdjacentWord(selectedWord, "next");

								if (nextWord) {
									setSelectedWord(nextWord);
									nextRow = nextWord.start_row;
									nextCol = nextWord.start_col;
								} else {
									return;
								}
							}
						} else {
							nextRow++;
							if (
								nextRow >=
								selectedWord.start_row + selectedWord.word.length
							) {
								const nextWord = findAdjacentWord(selectedWord, "next");

								if (nextWord) {
									setSelectedWord(nextWord);
									nextRow = nextWord.start_row;
									nextCol = nextWord.start_col;
								} else {
									return;
								}
							}
						}
					}
					handleInputFocus(nextRow, nextCol);
				}
				return;
		}

		handleInputFocus(nextRow, nextCol);
	};

	function handleInputFocus(nextRow: number, nextCol: number) {
		const nextKey = `${nextRow}-${nextCol}`;
		const nextInput = inputRefs.current[nextKey];
		if (nextInput && crosswordGrid[nextRow][nextCol] !== "#") {
			nextInput.focus();
		}
	}

	return {
		cellData,
		completedWords,
		inputRefs,
		clueListRef,
		selectedWord,
		onCellSelect,
		manageCellNavigation,
	};
};
