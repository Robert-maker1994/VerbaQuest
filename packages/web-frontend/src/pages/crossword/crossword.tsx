import {
	Box,
	Button,
	CircularProgress,
	Container,
	Grid2,
	Typography,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import CongratulationDialog from "./components/congratulationDialog";
import CrosswordGrid from "./components/crosswordGrid";
import { useCrossword } from "./crosswordContext";

const Crossword = React.memo(function Crossword() {
	const { crosswordId } = useParams();
	const { crosswordData, getCrossword, saveUserProgress } = useCrossword();
	const [open, setOpen] = React.useState(false);
	const nav = useNavigate();

	const [seconds, setSeconds] = useState(0);
	const timerId = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (crosswordData.id) {
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

	async function handleCompletion(completed: boolean) {
		try {
			if (timerId.current) {
				clearInterval(timerId.current);
				setSeconds(0);
			}
			await saveUserProgress(crosswordData.id, seconds, completed);
		} catch (err) {
			console.error(err);
		} finally {
			setOpen(!open);
		}
	}

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
		<Container maxWidth="lg">
			<Grid2 container spacing={2} justifyContent={"center"}>
				<Grid2
					size={12}
					sx={{ display: "flex", justifyContent: "space-between" }}
				>
					<Button
						size="small"
						onClick={() => {
							nav("/crossword");
							handleCompletion(false);
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
						handleCompletion(true);
					}}
				/>
			</Grid2>
		</Container>
	);
});

export default Crossword;
