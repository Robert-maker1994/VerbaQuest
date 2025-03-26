import { Box, styled } from "@mui/material";
import { pickCellColor } from ".";
import type { CellState } from "../pages/crossword/interface";

interface StyledCellProps {
    cellState: CellState;
    isActive: boolean;
}

export const StyledCell = styled(Box)<StyledCellProps>(({ cellState, isActive }) => ({
    border: "1px solid black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.2em",
    boxSizing: "border-box",
    borderRadius: "5px",
    background: pickCellColor(cellState, isActive),
    position: "relative",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    caretColor: "transparent",
    transition: "background-color 0.3s ease",
}));