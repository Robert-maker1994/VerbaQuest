import { Box, CircularProgress, Grid2, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { ClueList } from ".";
import type { WordData } from "../interfaces";
import CrosswordGrid from "./crosswordGrid";

interface CrosswordResponse {
	crossword: string[][];
	title: string;
	metadata: WordData[];
}

function Crossword() {
	const [crosswordData, setCrosswordData] = useState<CrosswordResponse | null>(
		null,
	);
	useEffect(() => {
		if (!crosswordData) {
			axios
				.get<CrosswordResponse>("http://localhost:5001/crossword/today")
				.then((response) => {
					setCrosswordData(response.data);
				})
				.catch((error) => {
					console.error("Error fetching crossword data:", error);
				});
		}
	}, [crosswordData]);

	if (!crosswordData) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Grid2 container spacing={2}>
			<Grid2 size={12}>
				<Typography variant="h4" align="center" gutterBottom>
					{crosswordData.title}
				</Typography>
			</Grid2>
			<Grid2 size={6}>
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
}

export default Crossword;
