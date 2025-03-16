import type { WordData } from "@verbaquest/shared";
import {
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

export interface CellData {
	value: string;
	state: CellState;
}
export enum CellState {
	Correct = 0,
	Incorrect = 1,
	Empty = 2,
	Partial = 3,
}
interface UseCrosswordGridProps {
	crosswordGrid: string[][];
	metadata: WordData[];
}

interface UseCrosswordGridReturn {
	cellData: Map<string, CellData>;
	selectedWord: WordData | null;
	completedWords: number[];
	inputRefs: RefObject<{ [key: string]: HTMLInputElement | null }>;
	clueListRef: React.RefObject<HTMLDivElement | null>;
	getCellNumbers: (row: number, col: number) => number[] | null;
	handleClueClick: (word: WordData) => void;
	handleCellClick: (row: number, col: number) => void;
	handleKeyDown: (
		row: number,
		col: number,
		event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
}

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

	const getCellNumbers = useCallback(
		(row: number, col: number): number[] | null => {
			const words = metadata?.filter((item) => {
				return item.start_row === row && item.start_col === col;
			});
			if (words?.length === 0) return null;

			return words?.map(
				(word) => metadata.findIndex((w) => w.word_id === word.word_id) + 1,
			);
		},
		[metadata],
	);

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

	const handleClueClick = (word: WordData) => {
		handleInputFocus(word.start_row, word.start_col);
		setSelectedWord(word);
	};

	const handleCellClick = (row: number, col: number) => {
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

	const handleKeyDown = (
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

		let nextRow = row;
		let nextCol = col;
		switch (event.key) {
			case "ArrowUp":
				nextRow--;
				if (nextRow < 0) {
					return; // Prevent moving above the grid
				}
				handleCellClick(nextRow, nextCol);
				break;
			case "ArrowDown":
				nextRow++;
				if (nextRow >= crosswordGrid.length) {
					return; // Prevent moving below the grid
				}
				handleCellClick(nextRow, nextCol);

				break;
			case "ArrowLeft":
				nextCol--;
				if (nextCol < 0) {
					return; // Prevent moving to the left of the grid
				}
				handleCellClick(nextRow, nextCol);

				break;
			case "ArrowRight":
				nextCol++;
				if (nextCol >= crosswordGrid[0].length) {
					return; // Prevent moving to the right of the grid
				}
				handleCellClick(nextRow, nextCol);

				break;
			case "Backspace":
				if (currentCellData?.value !== "") {
					setCellData((prevCellData) => {
						const newCellData = new Map(prevCellData);

						newCellData.set(key, { value: "", state: CellState.Empty });
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

						newCellData.set(key, { value, state: newCellState });
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
		getCellNumbers,
		handleClueClick,
		handleCellClick,
		handleKeyDown,
	};
};
