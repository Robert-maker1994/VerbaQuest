import { Box, Grid2, Input } from "@mui/material";
import { useRef, useState } from "react";
import type { WordData } from "../interfaces";

interface CrosswordProps {
	crosswordGrid: string[][];
	metadata: WordData[];
}

const CrosswordGrid: React.FC<CrosswordProps> = ({
	crosswordGrid,
	metadata,
}) => {
	const [cellValues, setCellValues] = useState<{ [key: string]: string }>({});
	const [correctCells, setCorrectCells] = useState<{
		[key: string]: boolean;
	}>({});
	const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
	const sortedMetadata = [...metadata].sort((a, b) => {
		if (a.start_row !== b.start_row) {
			return a.start_row - b.start_row;
		}
		return a.start_col - b.start_col;
	});

	const getNextWord = (word: WordData): { row: number; col: number } | null => {
		const index = sortedMetadata.indexOf(word) + 1;
		if (index >= sortedMetadata.length) return null;
		const nextWord = sortedMetadata[index];
		return { row: nextWord.start_row, col: nextWord.start_col };
	};

	const handleInputChange = (
		rowIndex: number,
		colIndex: number,
		value: string,
		correctValue: string,
	) => {
		const key = `${rowIndex}-${colIndex}`;
		const newValue = value.slice(0, 1); // Limit to one character
		setCellValues((prevValues) => ({ ...prevValues, [key]: newValue }));
		const isCorrect =
			newValue.toLocaleLowerCase() === correctValue.toLocaleLowerCase();
		setCorrectCells((prevCorrect) => ({
			...prevCorrect,
			[key]: isCorrect,
		}));

		if (isCorrect && newValue) {
			const currentWord = metadata.find((word) => {
				if (word.direction === "horizontal") {
					return (
						word.start_row === rowIndex &&
						colIndex >= word.start_col &&
						colIndex < word.start_col + word.word.length
					);
				}
				return (
					word.start_col === colIndex &&
					rowIndex >= word.start_row &&
					rowIndex < word.start_row + word.word.length
				);
			});

			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			const nextCell = getNextCell(
				rowIndex,
				colIndex,
				crosswordGrid,
				cellValues,
				currentWord!,
			);
			if (nextCell) {
				const nextKey = `${nextCell.row}-${nextCell.col}`;
				const nextInput = inputRefs.current[nextKey];
				if (nextInput) {
					nextInput.focus();
				}
			} else {
				if (currentWord) {
					const nextWord = getNextWord(currentWord);
					if (nextWord) {
						const nextKey = `${nextWord.row}-${nextWord.col}`;
						const nextInput = inputRefs.current[nextKey];
						if (nextInput) {
							nextInput.focus();
						}
					}
				}
			}
		}
	};

	const shouldHaveNumber = (
		rowIndex: number,
		colIndex: number,
	): number | null => {
		const foundMetadata = metadata.find((item) => {
			return item.start_col === colIndex && item.start_row === rowIndex;
		});

		if (foundMetadata) {
			return metadata.indexOf(foundMetadata) + 1;
		}
		return null;
	};
	return (
		<Grid2 container spacing={1}>
			{crosswordGrid.map((row: string[], rowIndex: number) => (
				<Grid2 container key={rowIndex}>
					{row.map((cell: string, colIndex: number) => {
						const key = `${rowIndex}-${colIndex}`;
						if (cell === "#") {
							return (
								<Grid2 key={colIndex}>
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

						return (
							<Grid2 key={colIndex}>
								<CrosswordCell
									value={cellValues[key] || ""}
									correctCells={correctCells[key] || false}
									displayNumber={shouldHaveNumber(rowIndex, colIndex)}
									inputRef={(ref) => {
										if (ref) {
											inputRefs.current[key] = ref;
										}
									}}
									onInputChange={(value) =>
										handleInputChange(rowIndex, colIndex, value, cell)
									}
								/>
							</Grid2>
						);
					})}
				</Grid2>
			))}
		</Grid2>
	);
};

interface CrosswordCellProps {
	value: string;
	correctCells: boolean;
	displayNumber: number | null;
	onInputChange: (value: string) => void;
	inputRef: (ref: HTMLInputElement | null) => void;
}

const CrosswordCell: React.FC<CrosswordCellProps> = ({
	value,
	correctCells,
	displayNumber,
	onInputChange,
	inputRef,
}) => {
	const correctColor = correctCells
		? "lightgreen"
		: "linear-gradient(to bottom, #80deea, #4dd0e1)";

	return (
		<Box
			sx={{
				border: "1px solid black",
				justifyContent: "center",
				alignItems: "center",
				fontSize: " 1.2em",
				boxSizing: "border-box",
				borderRadius: "5px",
				background: correctColor,
				position: "relative",
				width: "40px",
				height: "40px",
			}}
		>
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					fontSize: "10px",
				}}
			>
				{displayNumber}
			</Box>

			<Input
				type="text"
				value={value}
				onChange={(e) => onInputChange(e.target.value)}
				inputProps={{
					maxLength: 1,
					style: {
						textAlign: "center",
					},
				}}
				inputRef={inputRef}
				sx={{
					textAlign: "center",
					width: "100%",
				}}
			/>
		</Box>
	);
};

function getNextCell(
	row: number,
	col: number,
	crosswordGrid: string[][],
	cellValues: { [key: string]: string },
	currentWord: WordData,
): { row: number; col: number } | null {
	if (!currentWord) {
		return null;
	}
	let nextRow = row;
	let nextCol = col;

	const nextCellIsValid = (row: number, col: number): boolean => {
		return (
			nextCol >= 0 &&
			nextCol < crosswordGrid[row].length &&
			nextRow >= 0 &&
			nextRow < crosswordGrid.length &&
			crosswordGrid[nextRow][nextCol] !== "#"
		);
	};

	while (true) {
		if (currentWord.direction === "horizontal") {
			nextCol++;
		} else {
			nextRow++;
		}

		if (!nextCellIsValid(nextRow, nextCol)) return null;

		const nextKey = `${nextRow}-${nextCol}`;
		const nextCellValue = cellValues[nextKey];

		if (!nextCellValue) {
			break;
		}

		if (currentWord.direction === "horizontal") {
			if (nextCol >= currentWord.start_col + currentWord.word.length) {
				return null;
			}
		} else {
			if (nextRow >= currentWord.start_row + currentWord.word.length) {
				return null;
			}
		}
	}

	return { row: nextRow, col: nextCol };
}

export default CrosswordGrid;
