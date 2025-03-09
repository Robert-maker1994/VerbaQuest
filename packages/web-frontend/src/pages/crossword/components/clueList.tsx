import { Box, Button, Typography } from "@mui/material";
import type { WordData } from "../../../interfaces";
import { useState } from "react";

const Clue = ({
    word,
    index,
    onClueClick,
    isSelected
}: {
    word: WordData;
    index: number;
    onClueClick: (word: WordData) => void;
    isSelected: boolean;
}) => {
    const [revealedWords, setRevealedWords] = useState<string[]>([]); // New state
    const handleRevealWord = (word: WordData) => {
        setRevealedWords([...revealedWords, word.word]);

    };
    return (
        <Box
            sx={{
                cursor: "pointer",
                background: isSelected ? "lightyellow" : "inherit",
                padding: "5px",
                borderRadius: "5px",
                marginBottom: "5px",
                display: "flex", // Use flexbox to align items
                alignItems: "center", // Center items vertically
            }}
            data-word-key={`${word.start_row}-${word.start_col}`}
        >
            <Box onClick={() => onClueClick(word)} sx={{ flexGrow: 1 }}> {/* Make the main clue area take up space */}
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

interface ClueListProps {
    metadata: WordData[];
    onClueClick: (word: WordData) => void;
    selectedWord: WordData | null;
}

// ClueList component moved inside
const ClueList: React.FC<ClueListProps> = ({ metadata, onClueClick, selectedWord }) => {
    const horizontal = metadata.filter((item) => item.direction === "horizontal");
    const vertical = metadata.filter((item) => item.direction === "vertical");

    return (
        <Box>
            <Typography>Horizontal</Typography>
            <Box>
                {horizontal.map((word) => (
                    <Clue
                        key={`${word.start_row}-${word.start_col}`}
                        word={word}
                        index={metadata.findIndex(item => item.word === word.word)}
                        onClueClick={onClueClick}
                        isSelected={
                            selectedWord?.start_row === word.start_row &&
                            selectedWord.start_col === word.start_col
                        }
                    />
                ))}
            </Box>

            <Typography>Vertical</Typography>
            <Box>
                {vertical.map((word,) => (
                    <Clue
                        key={`${word.start_row}-${word.start_col}`}
                        word={word}
                        index={metadata.findIndex(item => item.word === word.word)}
                        onClueClick={onClueClick}
                        isSelected={
                            selectedWord?.start_row === word.start_row &&
                            selectedWord.start_col === word.start_col
                        }
                    />
                ))}
            </Box>
        </Box>
    );
};

export default ClueList;