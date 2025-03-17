import { Box, Input } from "@mui/material";
import { memo } from "react";
import { type CellData, CellState } from "../interface";

/**
 * Interface defining the props for the `CrosswordCell` component.
 * @interface CrosswordCellProps
 */
interface CrosswordCellProps {
	/**
	 * The CellData object for this cell, or undefined if the cell is not part of the grid.
	 */
	cellData: CellData | undefined;
	/**
	 * Boolean indicating whether the cell is currently selected.
	 */
	selected: boolean;
	/**
	 * An array of numbers to display at the start of the cell (clue numbers).
	 */
	startNumber: number[];
	/**
	 * A ref to the input element within the cell, allowing for direct DOM manipulation.
	 */
	inputRef: React.Ref<HTMLInputElement>;
	/**
	 * Callback function triggered when the cell is clicked.
	 */
	onCellClick: () => void;
	/**
	 * Callback function triggered when a key is pressed within the cell's input.
	 * @param {React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>} e - The keyboard event.
	 */
	onKeyCapture: (
		e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
}

/**
 * Renders a single cell within the crossword grid.
 * @param {CrosswordCellProps} props - The component's properties.
 * @returns {JSX.Element} The rendered crossword cell.
 */
const CrosswordCellContainer: React.FC<CrosswordCellProps> = ({
	cellData,
	selected,
	onKeyCapture,
	startNumber,
	inputRef,
	onCellClick,
}) => {
	if (!cellData) return <></>;
	return (
		<Box
			onClick={onCellClick}
			sx={{
				border: "1px solid black",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				fontSize: "1.2em",
				boxSizing: "border-box",
				borderRadius: "5px",
				background: pickCellColor(cellData.state, selected),
				position: "relative",
				width: "40px",
				height: "40px",
				cursor: "pointer",
				transition: "background-color 0.3s ease",
			}}
		>
			{startNumber?.map((num, index) => (
				<Box
					key={`${num}-${num * 1}`}
					sx={{
						position: "absolute",
						top: index === 0 ? "0px" : "10px",
						left: "0px",
						fontSize: "10px",
					}}
				>
					{num}
				</Box>
			))}

			<Input
				type="text"
				value={cellData.value}
				onKeyDown={(
					e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
				) => {
					if (e.key) {
						onKeyCapture(e);
					}
				}}
				inputProps={{
					maxLength: 1,
					style: {
						textAlign: "center",
						textTransform: "uppercase",
					},
				}}
				inputRef={inputRef}
				disableUnderline
			/>
		</Box>
	);
};

const CrosswordCell = memo(CrosswordCellContainer);

export default CrosswordCell;

const pickCellColor = (cellState: CellState, isSelected: boolean) => {
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
