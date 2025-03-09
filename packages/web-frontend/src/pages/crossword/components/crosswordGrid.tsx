import { Box, Grid2 } from "@mui/material";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { WordData } from "../../../interfaces";
import ClueList from "./clueList";
import CrosswordCell from "./crosswordCell";

interface CrosswordProps {
	crosswordGrid: string[][];
	metadata: WordData[];
}

const CrosswordGridComponent: React.FC<CrosswordProps> = ({
	crosswordGrid,
	metadata,
}) => {
	const [cellValues, setCellValues] = useState<{ [key: string]: string }>({});
	const [correctCells, setCorrectCells] = useState<{
		[key: string]: boolean;
	}>({});
	const [completedWords, setCompletedWords] = useState<string[]>([]);
	const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
	const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
	const clueListRef = useRef<HTMLDivElement>(null);

	// Memoized getCellNumbers function
	const getCellNumbers = useCallback(
		(row: number, col: number): number[] | null => {
			const words = metadata.filter(
				(item) => item.start_row === row && item.start_col === col,
			);
			if (words.length === 0) return null;
			return words.map((word) => metadata.indexOf(word) + 1);
		},
		[metadata],
	);

	useEffect(() => {
		if (selectedWord && clueListRef.current) {
			const selectedClueElement = clueListRef.current.querySelector(
				`[data-word-key="${selectedWord.start_row}-${selectedWord.start_col}"]`,
			);
			if (selectedClueElement) {
				selectedClueElement.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
				});
			}
		}
	}, [selectedWord]);

	const isWordComplete = useCallback(
		(word: WordData): boolean => {
			for (let i = 0; i < word.word.length; i++) {
				const row =
					word.direction === "horizontal"
						? word.start_row
						: word.start_row + i;
				const col =
					word.direction === "horizontal"
						? word.start_col + i
						: word.start_col;
				const key = `${row}-${col}`;
				if (
					!cellValues[key] ||
					cellValues[key].toLowerCase() !==
						crosswordGrid[row][col].toLowerCase()
				) {
					return false;
				}
			}
			return true;
		},
		[cellValues, crosswordGrid],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const newCompletedWords = metadata
			.filter(isWordComplete)
			.map((word) => `${word.start_row}-${word.start_col}`)
			.filter((wordKey) => !completedWords.includes(wordKey));

		if (newCompletedWords.length > 0) {
			setCompletedWords((prevCompleted) => [
				...prevCompleted,
				...newCompletedWords,
			]);

			// Automatically select the next word after completing one
			if (
				selectedWord &&
				newCompletedWords.includes(
					`${selectedWord.start_row}-${selectedWord.start_col}`,
				)
			) {
				const nextWord = findNextWord(selectedWord);
				if (nextWord) {
					setSelectedWord(nextWord);
					// And focus its first cell
					const firstCellKey = `${nextWord.start_row}-${nextWord.start_col}`;
					inputRefs.current[firstCellKey]?.focus();
				}
			}
		}
	}, [metadata, isWordComplete, completedWords, selectedWord]);

	const handleInputChange = (
		rowIndex: number,
		colIndex: number,
		value: string,
	) => {
		const key = `${rowIndex}-${colIndex}`;
		const correctValue = crosswordGrid[rowIndex][colIndex];

		setCellValues((prevValues) => ({ ...prevValues, [key]: value }));
		setCorrectCells((prevCorrect) => ({
			...prevCorrect,
			[key]: value.toLowerCase() === correctValue.toLowerCase(),
		}));

		if (value.toLowerCase() === correctValue.toLowerCase() && value !== "") {
			focusNextCell(rowIndex, colIndex);
		}
	};

	const focusNextCell = (row: number, col: number) => {
		const currentWord = metadata.find((word) => {
			if (word.direction === "horizontal") {
				return (
					row === word.start_row &&
					col >= word.start_col &&
					col < word.start_col + word.word.length
				);
			}
			return (
				col === word.start_col &&
				row >= word.start_row &&
				row < word.start_row + word.word.length
			);
		});

		if (!currentWord) return;

		let nextRow = row;
		let nextCol = col;

		if (currentWord.direction === "horizontal") {
			nextCol++;
			if (nextCol >= currentWord.start_col + currentWord.word.length) {
				const nextWord = findNextWord(currentWord);
				if (nextWord) {
					nextRow = nextWord.start_row;
					nextCol = nextWord.start_col;
				} else {
					return;
				}
			}
		} else {
			nextRow++;
			if (nextRow >= currentWord.start_row + currentWord.word.length) {
				const nextWord = findNextWord(currentWord);
				if (nextWord) {
					nextRow = nextWord.start_row;
					nextCol = nextWord.start_col;
				} else {
					return;
				}
			}
		}

		const nextKey = `${nextRow}-${nextCol}`;
		const nextInput = inputRefs.current[nextKey];

		if (nextInput && crosswordGrid[nextRow][nextCol] !== "#") {
			nextInput.focus();
		} else {
			focusNextCell(nextRow, nextCol);
		}
	};

	const findNextWord = useCallback(
		(currentWord: WordData): WordData | undefined => {
			const sortedWords = [...metadata].sort((a, b) => {
				if (a.start_row !== b.start_row) {
					return a.start_row - b.start_row;
				}
				return a.start_col - b.start_col;
			});

			const currentIndex = sortedWords.indexOf(currentWord);
			if (currentIndex === -1 || currentIndex === sortedWords.length - 1) {
				return undefined; // Current word not found or is the last word
			}
			return sortedWords[currentIndex + 1];
		},
		[metadata],
	);
	const handleClueClick = (word: WordData) => {
		setSelectedWord(word);
		const firstCellKey = `${word.start_row}-${word.start_col}`;
		inputRefs.current[firstCellKey]?.focus();
	};

	const handleCellClick = (row: number, col: number) => {
		const word = metadata.find(
			(w) =>
				(w.direction === "horizontal" &&
					w.start_row === row &&
					col >= w.start_col &&
					col < w.start_col + w.word.length) ||
				(w.direction === "vertical" &&
					w.start_col === col &&
					row >= w.start_row &&
					row < w.start_row + w.word.length),
		);

		if (word) {
			setSelectedWord(word);
		}
	};

	return (
		<Grid2 container spacing={1}>
			<Grid2 size={8}>
				<Grid2 container spacing={0}>
					{crosswordGrid.map((row, rowIndex) => (
						<Grid2 container key={`${rowIndex}-${rowIndex * 2}`} size={12} wrap="nowrap" spacing={0}>
							{row.map((cell, colIndex) => {
								const key = `${rowIndex}-${colIndex}`;
								if (cell === "#") {
									return (
										<Grid2 key={key}>
											<Box
												sx={{
													border: "1px solid #ddd",
													boxSizing: "border-box",
													background:
														"linear-gradient(to bottom, #f8f8f8, #f0f0f0)",
													width: "40px",
													height: "40px",
												}}
											/>
										</Grid2>
									);
								}
								const wordForCell = metadata.find(
									(word) =>
										(word.direction === "horizontal" &&
											word.start_row === rowIndex &&
											colIndex >= word.start_col &&
											colIndex < word.start_col + word.word.length) ||
										(word.direction === "vertical" &&
											word.start_col === colIndex &&
											rowIndex >= word.start_row &&
											rowIndex < word.start_row + word.word.length),
								);
								const isCellSelected =
									selectedWord &&
									wordForCell &&
									selectedWord.start_row === wordForCell.start_row &&
									selectedWord.start_col === wordForCell.start_col;

								const isWordCompleted = wordForCell
									? completedWords.includes(
											`${wordForCell.start_row}-${wordForCell.start_col}`,
									  )
									: false;


								return (
									<Grid2 key={key}>
										<CrosswordCell
											value={cellValues[key] || ""}
											isCorrect={correctCells[key] || false}
											displayNumbers={getCellNumbers(rowIndex, colIndex)} // Pass the array
											onInputChange={(value) =>
												handleInputChange(rowIndex, colIndex, value)
											}
											inputRef={(ref) => {
												if (ref) {
													inputRefs.current[key] = ref;
												}
											}}
											isCompleted={isWordCompleted}
											isSelected={isCellSelected || false}
											onCellClick={() => handleCellClick(rowIndex, colIndex)}
										/>
									</Grid2>
								);
							})}
						</Grid2>
					))}
				</Grid2>
			</Grid2>
			<Grid2 size={4}>
				<Box ref={clueListRef} sx={{ maxHeight: "600px", overflowY: "auto" }}>
					<ClueList
						metadata={metadata}
						onClueClick={handleClueClick}
						selectedWord={selectedWord}
					/>
				</Box>
			</Grid2>
		</Grid2>
	);
};

const CrosswordGrid = memo(CrosswordGridComponent);

export default CrosswordGrid;