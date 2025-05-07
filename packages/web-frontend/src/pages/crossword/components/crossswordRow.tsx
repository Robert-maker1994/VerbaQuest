import { Grid2 } from "@mui/material";
import type { WordData } from "@verbaquest/types";
import type { RefObject } from "react";
import type { CellData } from "../interface";
import CrosswordCell from "./crosswordCell";

const CrosswordRow = ({
  row,
  rowIndex,
  metadata,
  cellData,
  selectedWord,
  manageCellNavigation,
  inputRefs,
  onCellSelect,
  wordMap,
}: {
  row: string[];
  rowIndex: number;
  metadata: WordData[];
  cellData: Map<string, CellData>;
  selectedWord: WordData | null;
  manageCellNavigation: (
    rowIndex: number,
    colIndex: number,
    value: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  inputRefs: RefObject<{
    [key: string]: HTMLInputElement | null;
  }>;
  onCellSelect: (row: number, col: number) => void;
  wordMap: Record<string, WordData[]>;
}) => {
  const isCellSelected = (cellState: CellData | undefined, selectedWord: WordData | null): boolean => {
    if (!cellState || !selectedWord) {
      return false;
    }
    return cellState.wordId.includes(selectedWord.word_id);
  };
  return (
    <Grid2 container justifyContent={"center"} key={crypto.randomUUID()} size={12} wrap="nowrap">
      {row.map((_cell, colIndex) => {
        const key = `${rowIndex}-${colIndex}`;
        const matchedWord = wordMap[`${rowIndex}-${colIndex}`] || [];
        const cellState = cellData.get(key);
        if (!cellState) return <></>;
        return (
          <Grid2 key={key} id={key}>
            <CrosswordCell
              cellData={cellState}
              selected={isCellSelected(cellState, selectedWord)}
              onKeyCapture={(value) => {
                if (value.key) {
                  manageCellNavigation(rowIndex, colIndex, value);
                }
              }}
              startNumber={matchedWord.map((word) => metadata.indexOf(word) + 1)}
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
  );
};

export default CrosswordRow;
