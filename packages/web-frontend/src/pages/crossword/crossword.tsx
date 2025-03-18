import {
	Box,
	Button,
	CircularProgress,
	Grid2,
	Typography,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import CrosswordGrid from "./components/crosswordGrid";
import { useCrossword } from "./crosswordContext";
import CongratulationDialog from "./components/congratulationDialog";

const Crossword = React.memo(function Crossword() {
	const { crosswordId } = useParams();
	const { crosswordData, getCrossword, saveUserProgress } = useCrossword();
	const [open, setOpen] = React.useState(false);
	const nav = useNavigate();

	// Timer state and logic
	const [seconds, setSeconds] = useState(0);
	const timerId = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (crosswordData.id) {
			// Start the timer when crosswordData is loaded
			timerId.current = setInterval(() => {
				setSeconds((prevSeconds) => prevSeconds + 1);
			}, 1000);
		}
		return () => {
			if (timerId.current) {
				clearInterval(timerId.current);
			}
		};
	}, [crosswordData.id]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (crosswordId) {
			getCrossword(crosswordId);
		}
	}, [crosswordId]);

	async function handleCompletion() {
		try {
			if (timerId.current) {
				clearInterval(timerId.current);
			}
			await saveUserProgress(crosswordData.id, seconds); // Call saveUserProgress here

		} catch (err) {
			console.error(err);
		} finally {
			setOpen(!open);
		}
	}

	// Format the time for display
	const formatTime = (timeInSeconds: number) => {
		const minutes = Math.floor(timeInSeconds / 60);
		const remainingSeconds = timeInSeconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
			.toString()
			.padStart(2, "0")}`;
	};

	if (!crosswordData) {
		return (
			<Box>
				<CircularProgress />
			</Box>
		);
	}
	return (
		<Grid2 container spacing={2} justifyContent={"center"}>
			<Grid2
				size={12}
				sx={{ display: "flex", justifyContent: "space-between" }}
			>
				<Button
					size="small"
					onClick={() => {
						nav("/crossword");
					}}
					variant="contained"
					disableElevation
					color="primary"
				>
					Navigate to Crossword
				</Button>
				<Typography variant="h6">Time: {formatTime(seconds)}</Typography>
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
					handleCompletion={handleCompletion}
				/>
			</Grid2>
			<CongratulationDialog
				open={open}
				onClose={() => {
					setOpen(!open);
					handleCompletion()
				}}
			/>
		</Grid2>
	);
});

export default Crossword;
