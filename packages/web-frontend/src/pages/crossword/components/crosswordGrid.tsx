import { Box, Grid2 } from "@mui/material";
import type { WordData } from "@verbaquest/types";
import { memo, useEffect } from "react";
import HoverBox from "../../../components/hoverBox";
import { useCrosswordGrid } from "../hooks/useCrosswordGrid";
import ClueList from "./clueList";
import CrosswordRow from "./crossswordRow";

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


const CrosswordGridComponent: React.FC<CrosswordProps> = ({ crosswordGrid, metadata, handleCompletion }) => {
  const { cellData,
    completedWords, inputRefs, clueListRef, selectedWord, onCellSelect, manageCellNavigation, wordsWithStatus, wordMap } =
    useCrosswordGrid({ crosswordGrid, metadata });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (completedWords.length > 0 && completedWords.length === metadata.length) {
      handleCompletion(true);
    }
  }, [completedWords]);

  return (
    <Grid2 container spacing={3} justifyContent={"space-evenly"}>
      <Grid2 size={7}>
        <HoverBox>
          {crosswordGrid.map((row, rowIndex) => (
            <CrosswordRow
              key={crypto.randomUUID()}
              row={row}
              rowIndex={rowIndex}
              metadata={metadata}
              cellData={cellData}
              selectedWord={selectedWord}
              manageCellNavigation={manageCellNavigation}
              inputRefs={inputRefs}
              onCellSelect={onCellSelect}
              wordMap={wordMap}
            />
          ))}
        </HoverBox>
      </Grid2>
      <Grid2 size={4}>
        <Box ref={clueListRef} sx={{ maxHeight: "600px", overflowY: "auto" }}>
          <ClueList
            metadata={wordsWithStatus}
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
