import { Box, CircularProgress, Grid2, Typography } from "@mui/material";
import React from "react";
import CrosswordGrid from "./components/crosswordGrid";
import { useCrossword } from "./crosswordContext";


const Crossword = React.memo(function Crossword() {
	const { crosswordData } = useCrossword();
	
	if (!crosswordData) {
		return (
			<Box>
				<CircularProgress />
			</Box>
		);
	}
	return (
		<Grid2 container spacing={2} justifyContent={"center"}>
			<Grid2 size={12}>
				<Typography color="primary" variant="h4" align="center">
					{crosswordData.title}
				</Typography>
			</Grid2>
			<Grid2 size={12}>
				<CrosswordGrid
					crosswordGrid={crosswordData.crossword}
					metadata={crosswordData.metadata}
				/>
			</Grid2>
		</Grid2>
	);
});

export default Crossword;