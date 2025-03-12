import { Box, Button, CircularProgress, Grid2, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../context/api/api";
import CrosswordGrid from "./components/crosswordGrid";
import { useCrossword } from "./crosswordContext";

const Crossword = React.memo(function Crossword() {
	const { crosswordId } = useParams();
	const { crosswordData, setCrosswordData } = useCrossword();
	const nav = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (crosswordId) {
					const data = await api.getSpecificCrossword(Number.parseInt(crosswordId));
					setCrosswordData(data);
				}
			} catch (err) {
				console.error(err);
			}
		};

		fetchData();
	}, [crosswordId, setCrosswordData]);
	if (!crosswordData) {
		return (
			<Box>
				<CircularProgress />
			</Box>
		);
	}
	async function createUserProgress() {
		const created = await api.createCrosswordForLoginUser(
			crosswordData.id,
			crosswordData.crossword,
			crosswordData.isComplete,
		);
		return !!created;
	}
	return (
		<Grid2 container spacing={2} justifyContent={"center"}>
			<Grid2 size={12} sx={{ display: "flex", justifyContent: "space-between" }}>
				<Button onClick={() => {
					nav("/crossword")
				}} variant="contained" disableElevation color="primary">
					Navigate to Crossword
				</Button>
				<Button onClick={() => {
					createUserProgress()
				}} variant="contained" disableElevation color="primary">
					Save Progress
				</Button>
			</Grid2>
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
		</Grid2 >
	);
});

export default Crossword;
