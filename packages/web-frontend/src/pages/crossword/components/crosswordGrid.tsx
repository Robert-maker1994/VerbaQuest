import { Box, Grid2 } from "@mui/material";
import type { WordData } from "@verbaquest/shared";
import { memo, useEffect } from "react";
import { useCrosswordGrid } from "../hooks/useCrosswordGrid";
import ClueList from "./clueList";
import CrosswordCell from "./crosswordCell";
import HoverBox from "../../../components/hoverBox";

/**
 * Interface for the props of the CrosswordGrid component.
 */
interface CrosswordProps {
	/**
	 * The 2D array representing the crossword grid.
	 */
	crosswordGrid: string[][];
	/**
	 * Metadata about the words in the crossword, including their definitions,
	 * starting positions, and directions.
	 */
	metadata: WordData[];
	/**
	 * Callback function to be executed when the crossword is completed.
	 */
	handleCompletion: (completed: boolean) => void;
}

/**
 * Renders the crossword grid and clue list. Visual component for the rendering of the crossword puzzle
 *
 * @param {CrosswordProps} props - The component's properties.
 * @returns {JSX.Element} The rendered crossword grid and clue list.
 */
const CrosswordGridComponent: React.FC<CrosswordProps> = ({
	crosswordGrid,
	metadata,
	handleCompletion,
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (
			completedWords.length > 0 &&
			completedWords.length === metadata.length
		) {
			handleCompletion(true);
		}
	}, [completedWords]);

	return (
		<Grid2 container spacing={3} justifyContent={"space-evenly"}>
			<Grid2 size={7}>
				<HoverBox>
					{crosswordGrid.map((row, rowIndex) => (
						<Grid2
							container
							justifyContent={"center"}
							key={`${rowIndex}-${rowIndex * 2}`}
							size={12}
							wrap="nowrap"
						>
							{row.map((_cell, colIndex) => {
								const key = `${rowIndex}-${colIndex}`;
								const matchedWord = metadata.filter((word) => {
									return (
										word.start_row === rowIndex && word.start_col === colIndex
									);
								});
								const cellState = cellData.get(key);
								if (!cellState) return <></>;
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
				</HoverBox>
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
		</Grid2>
	);
};

const CrosswordGrid = memo(CrosswordGridComponent);

export default CrosswordGrid;
