import { Box, Typography } from "@mui/material";
import type { WordData } from "../../../interfaces";

interface ClueListProps {
	metadata: WordData[];
}

export const ClueList: React.FC<ClueListProps> = ({ metadata }) => {
	return (
		<Box>
			<Typography variant="h6">Clues</Typography>
			<Box>
				{metadata.map((item, index) => (
					<Typography key={item.word}>
						{index + 1}. {item.definition} -{" "}
						{item.direction === "horizontal" ? "Across" : "Down"}
					</Typography>
				))}
			</Box>
		</Box>
	);
};
