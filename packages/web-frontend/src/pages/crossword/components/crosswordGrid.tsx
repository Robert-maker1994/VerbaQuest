import { Box, Grid2 } from "@mui/material";
import { memo } from "react";
import type { WordData } from "../../../interfaces";
import { type CellData, CellState, useCrosswordGrid } from "../hooks/useCrosswordGrid";
import ClueList from "./clueList";
import CrosswordCellContainer from "./crosswordCell";

interface CrosswordProps {
	crosswordGrid: string[][];
	metadata: WordData[];
}


const CrosswordGridComponent: React.FC<CrosswordProps> = ({
	crosswordGrid,
	metadata,
}) => {
	const {
		cellData,
		completedWords,
		selectedWord,
		getCellNumbers,
		handleInputChange,
		handleClueClick,
		handleCellClick,
		inputRefs,
		clueListRef,
	} = useCrosswordGrid({ crosswordGrid, metadata });

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

								// Correctly find all words that include the cell
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

									if (wordsForCell.length === 1)
										return wordsForCell[0]; // Only one word

									// Check if selected word is in wordsForCell
									if (selectedWord && wordsForCell.includes(selectedWord)) {
										return selectedWord; // use selected word if it is present.
									}

									// prefer horizontal
									return wordsForCell.find(
										(w) => w.direction === "vertical",
									) || wordsForCell[0];
								};

								const currentWordForCell: WordData | null = wordForCell()

								const isCellSelected =
									selectedWord &&
									currentWordForCell &&
									(selectedWord.start_row === currentWordForCell.start_row &&
										selectedWord.start_col === currentWordForCell.start_col);

								const isWordCompleted = currentWordForCell
									? completedWords.includes(
										`${currentWordForCell.start_row}-${currentWordForCell.start_col}`,
									)
									: false;
								const cellInfo: CellData | undefined = cellData.get(key);
								const cellValue: string = cellInfo ? cellInfo.value : "";
								const cellState: CellState = cellInfo ? cellInfo.state : CellState.Empty;


								return (
									<Grid2 key={key}>
										<CrosswordCellContainer
											value={cellValue}
											cellState={cellState}
											displayNumbers={getCellNumbers(rowIndex, colIndex)} // Pass the array
											onInputChange={(value) =>
												handleInputChange(rowIndex, colIndex, value)
											}
											inputRef={(ref) => {
												if (ref) {
													inputRefs.current[key] = ref;
												}
											}}
											isCorrect={cellState === CellState.Correct}
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
