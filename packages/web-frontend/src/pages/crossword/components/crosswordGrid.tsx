import { Box, Grid2 } from "@mui/material";
import { memo, useEffect, useState } from "react";
import {
	type CellData,
	CellState,
	useCrosswordGrid,
} from "../hooks/useCrosswordGrid";
import ClueList from "./clueList";
import CongratulationDialog from "./congratulationDialog";
import CrosswordCell from "./crosswordCell";
import type { WordData } from "@verbaquest/shared";

interface CrosswordProps {
	crosswordGrid: string[][];
	metadata: WordData[];
}

const isCellInWord = (
	cellRow: number,
	cellCol: number,
	word: WordData,
): boolean => {
	if (word.direction === "horizontal") {
		return (
			cellRow === word.start_row &&
			cellCol >= word.start_col &&
			cellCol < word.start_col + word.word.length
		);
	}
	return (
		cellCol === word.start_col &&
		cellRow >= word.start_row &&
		cellRow < word.start_row + word.word.length
	);
};

const pickCellColor = (cellState: CellState, isSelected: boolean | null) => {
	let backgroundColor: string | undefined = "";

	switch (cellState) {
		case CellState.Correct:
			backgroundColor = "lightgreen";
			break;
		case CellState.Incorrect:
			backgroundColor = "red";
			break;
		case CellState.Partial:
			backgroundColor = "yellow";
			break;
		default:
			backgroundColor = isSelected
				? "lightyellow"
				: "linear-gradient(to bottom, #80deea, #4dd0e1)";
	}

	return backgroundColor;
};

const CrosswordGridComponent: React.FC<CrosswordProps> = ({
	crosswordGrid,
	metadata,
}) => {
	const {
		cellData,
		completedWords,
		inputRefs,
		clueListRef,
		selectedWord,
		getCellNumbers,
		handleClueClick,
		handleCellClick,
		handleKeyDown,
	} = useCrosswordGrid({ crosswordGrid, metadata });
	const [_completed, setCongratulation] = useState(false);

	useEffect(() => {
		if (Object.keys(inputRefs.current).length > 0) {
			inputRefs.current["0-0"]?.focus();
		}
	}, [inputRefs.current]);

	return (
		<Grid2 container spacing={1}>
			<Grid2 size={8}>
				<Grid2 container spacing={0}>
					{crosswordGrid.map((row, rowIndex) => (
						<Grid2
							container
							key={`${rowIndex}-${rowIndex * 2}`}
							size={12}
							wrap="nowrap"
							spacing={0}
						>
							{row.map((cell, colIndex) => {
								const key = `${rowIndex}-${colIndex}`;
								if (cell === "#") {
									return (
										<Grid2 key={key} id={key}>
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
								//get the word for the cell
								const wordsForCell = metadata.filter((word) => {
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

								// Select the correct word to use
								const wordForCell = () => {
									if (wordsForCell.length === 0) return null; // No word

									if (wordsForCell.length === 1) return wordsForCell[0]; // Only one word

									// Check if selected word is in wordsForCell
									if (
										wordsForCell?.some(
											(w) => w.word_id === selectedWord?.word_id,
										)
									) {
										return selectedWord; // use selected word if it is present.
									}

									// prefer horizontal
									return (
										wordsForCell.find((w) => w.direction === "horizontal") ||
										wordsForCell[0]
									);
								};
								//get the current word for the cell
								const currentWordForCell: WordData | null = wordForCell();

								const isCellSelected =
									selectedWord?.word_id &&
									selectedWord?.word_id === currentWordForCell?.word_id &&
									isCellInWord(rowIndex, colIndex, selectedWord);
								//get the cell data
								const cellInfo: CellData | undefined = cellData.get(key);
								//if there is no cell data set it to empty
								const cellValue: string = cellInfo ? cellInfo.value : "";

								return (
									<Grid2 key={key} id={key}>
										<CrosswordCell
											value={cellValue}
											displayNumbers={getCellNumbers(rowIndex, colIndex)}
											onKeyCapture={(value) => {
												if (value.key) {
													handleKeyDown(rowIndex, colIndex, value);
												}
											}}
											backgroundColour={pickCellColor(
												cellInfo ? cellInfo.state : CellState.Empty,
												!!isCellSelected,
											)}
											inputRef={(ref) => {
												if (ref) {
													inputRefs.current[key] = ref;
												}
											}}
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
						metadata={metadata.map((word) => {
							if (completedWords.find((v) => v === word.word_id)) {
								return {
									...word,
									isCompleted: true,
								};
							}
							return {
								...word,
								isCompleted: false,
							};
						})}
						onClueClick={handleClueClick}
						selectedWord={selectedWord}
					/>
				</Box>
			</Grid2>
			<CongratulationDialog
				open={
					completedWords.length > 0 && completedWords.length === metadata.length
				}
				onClose={() => {
					setCongratulation(false);
				}}
			/>
		</Grid2>
	);
};

const CrosswordGrid = memo(CrosswordGridComponent);

export default CrosswordGrid;
