import { CellState } from "../pages/crossword/interface";

export const pickCellColor = (cellState: CellState, isSelected: boolean) => {
  let backgroundColor: string | undefined = "";
  if (cellState === CellState.Correct) {
  }
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
      backgroundColor = isSelected ? "lightyellow" : "linear-gradient(to bottom, #80deea, #4dd0e1)";
  }

  return backgroundColor;
};
