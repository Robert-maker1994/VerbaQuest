import { Box, Button, Typography } from "@mui/material";
import type { WordData } from "@verbaquest/types";
import { useState } from "react";
import HoverBox from "../../../components/hoverBox";

const Clue = ({
	word,
	index,
	onClueClick,
	background,
}: {
	word: WordData;
	index: number;
	onClueClick: (row: number, col: number) => void;
	background: string;
}) => {
	const [revealedWords, setRevealedWords] = useState<string[]>([]); // New state
	const handleRevealWord = (word: WordData) => {
		setRevealedWords([...revealedWords, word.word]);
	};
	return (
		<Box
			sx={{
				cursor: "pointer",
				background: background,
				padding: "5px",
				borderRadius: "5px",
				marginBottom: "5px",
				display: "flex", // Use flexbox to align items
				alignItems: "center", // Center items vertically
			}}
			data-word-key={`${word.start_row}-${word.start_col}`}
		>
			<Box
				onClick={() => onClueClick(word.start_row, word.start_col)}
				sx={{ flexGrow: 1 }}
			>
				{" "}
				{/* Make the main clue area take up space */}
				<Typography>{`${index + 1}. ${word.definition}`}</Typography>
			</Box>

			<Button
				size="small"
				onClick={(event) => {
					event.stopPropagation();
					handleRevealWord(word);
				}}
			>
				{revealedWords.includes(word.word) ? word.word : "Reveal"}
			</Button>
		</Box>
	);
};
interface WordDataClue extends WordData {
	isCompleted: boolean;
}

interface ClueListProps {
	metadata: WordDataClue[];
	onClueClick: (row: number, col: number) => void;
	selectedWord: WordData | null;
}

const ClueList: React.FC<ClueListProps> = ({
	metadata,
	onClueClick,
	selectedWord,
}) => {
	const horizontal = metadata.filter((item) => item.direction === "horizontal");
	const vertical = metadata.filter((item) => item.direction === "vertical");

	const pickBackgroundColour = (isComplete: boolean, isSelected: boolean) => {
		if (isComplete) {
			return "lightgreen";
		}
		if (isSelected) {
			return "lightyellow";
		}
		return "inherit";
	};
	return (
		<HoverBox>
			<Typography fontWeight={"bold"}>Horizontal</Typography>
			<Box>
				{horizontal.map((word) => (
					<Clue
						key={`${word.start_row}-${word.start_col}`}
						word={word}
						index={metadata.findIndex((item) => item.word_id === word.word_id)}
						onClueClick={onClueClick}
						background={pickBackgroundColour(
							word.isCompleted,
							selectedWord?.start_row === word.start_row &&
								selectedWord.start_col === word.start_col,
						)}
					/>
				))}
			</Box>
			<Typography fontWeight={"bold"}>Vertical</Typography>
			<Box>
				{vertical.map((word) => (
					<Clue
						key={`${word.start_row}-${word.start_col}`}
						word={word}
						index={metadata.findIndex((item) => item.word === word.word)}
						onClueClick={onClueClick}
						background={pickBackgroundColour(
							word.isCompleted,
							selectedWord?.start_row === word.start_row &&
								selectedWord.start_col === word.start_col,
						)}
					/>
				))}
			</Box>
		</HoverBox>
	);
};

export default ClueList;
