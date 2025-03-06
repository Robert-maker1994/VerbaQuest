import { Box, CircularProgress, Grid2, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import type { WordData } from "../../interfaces";
import { ClueList } from "./components";
import CrosswordGrid from "./components/crosswordGrid";
import React from "react";

interface CrosswordResponse {
	crossword: string[][];
	title: string;
	metadata: WordData[];
}

const Crossword = React.memo(function Crossword() {
	const [crosswordData, setCrosswordData] = useState<CrosswordResponse>();

	useEffect(() => {
		if (!crosswordData?.title) {
			axios
				.get<CrosswordResponse>("http://localhost:5001/crossword/today")
				.then((response) => {
					setCrosswordData(response.data);
				})
				.catch((error) => {
					console.error("Error fetching crossword data:", error);
				});
		}
	});

	if (!crosswordData) {
		return (
			<Box>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Grid2 container spacing={2} justifyContent={"center"}>
			<Grid2 size={12} >
				<Typography color="primary" variant="h4" align="center">
					{crosswordData.title}
				</Typography>
			</Grid2>
			<Grid2 size={8}>
				<CrosswordGrid
					crosswordGrid={crosswordData.crossword}
					metadata={crosswordData.metadata}
				/>
			</Grid2>
			<Grid2 size={2}>
				<ClueList metadata={crosswordData.metadata} />
			</Grid2>
		</Grid2>
	);
})

export default Crossword;

