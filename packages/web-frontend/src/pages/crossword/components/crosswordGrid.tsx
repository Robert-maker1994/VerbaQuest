import { Box, Grid2 } from "@mui/material";
import type { WordData } from "@verbaquest/shared";
import { memo } from "react";
import { useCrosswordGrid } from "../hooks/useCrosswordGrid";
import ClueList from "./clueList";
import CongratulationDialog from "./congratulationDialog";
import CrosswordCell from "./crosswordCell";

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
		inputRefs,
		clueListRef,
		selectedWord,
		onCellSelect,
		manageCellNavigation,
	} = useCrosswordGrid({ crosswordGrid, metadata });

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
								const matchedWord = metadata.filter((word) => {
									return (
										word.start_row === rowIndex && word.start_col === colIndex
									);
								});
								const cellState = cellData.get(key);
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
								return (
									<Grid2 key={key} id={key}>
										<CrosswordCell
											cellData={cellState}
											selected={
												cellState
													? cellState?.wordId.includes(
															selectedWord?.word_id || 0,
														) || false
													: false
											}
											onKeyCapture={(value) => {
												if (value.key) {
													manageCellNavigation(rowIndex, colIndex, value);
												}
											}}
											startNumber={matchedWord.map(
												(word) => metadata.indexOf(word) + 1,
											)}
											inputRef={(ref) => {
												if (ref) {
													inputRefs.current[key] = ref;
												}
											}}
											onCellClick={() => onCellSelect(rowIndex, colIndex)}
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
							if (completedWords.find((v: number) => v === word.word_id)) {
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
						onClueClick={onCellSelect}
						selectedWord={selectedWord}
					/>
				</Box>
			</Grid2>
			<CongratulationDialog
				open={
					completedWords.length > 0 && completedWords.length === metadata.length
				}
				onClose={() => {}}
			/>
		</Grid2>
	);
};

const CrosswordGrid = memo(CrosswordGridComponent);

export default CrosswordGrid;
