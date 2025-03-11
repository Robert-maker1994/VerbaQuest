import { useCallback, useEffect, useRef, useState } from "react";
import type { WordData } from "../../../interfaces";

export interface CellData {
    value: string;
    state: CellState;
}
export enum CellState {
    Correct = 0,
    Incorrect = 1,
    Empty = 2
}
interface UseCrosswordGridProps {
    crosswordGrid: string[][];
    metadata: WordData[];
}

interface UseCrosswordGridReturn {
    cellData: Map<string, CellData>;
    completedWords: string[];
    selectedWord: WordData | null;
    getCellNumbers: (row: number, col: number) => number[] | null;
    handleInputChange: (rowIndex: number, colIndex: number, value: string) => void;
    handleClueClick: (word: WordData) => void;
    handleCellClick: (row: number, col: number) => void;
    inputRefs: React.RefObject<{ [key: string]: HTMLInputElement | null }>;
    clueListRef: React.RefObject<HTMLDivElement | null>;
}

export const useCrosswordGrid = ({
    crosswordGrid,
    metadata,
}: UseCrosswordGridProps): UseCrosswordGridReturn => {
    const [cellData, setCellData] = useState<Map<string, CellData>>(new Map());
    const [completedWords, setCompletedWords] = useState<string[]>([]);
    const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
    const clueListRef = useRef<HTMLDivElement>(null);

    const getCellNumbers = useCallback(
        (row: number, col: number): number[] | null => {
            const words = metadata.filter(
                (item) => item.start_row === row && item.start_col === col,
            );
            if (words.length === 0) return null;
            return words.map((word) => metadata.indexOf(word) + 1);
        },
        [metadata],
    );

    useEffect(() => {
        if (selectedWord && clueListRef.current) {
            const selectedClueElement = clueListRef.current.querySelector(
                `[data-word-key="${selectedWord.start_row}-${selectedWord.start_col}"]`,
            );
            if (selectedClueElement) {
                selectedClueElement.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        }
    }, [selectedWord]);

    const isWordComplete = useCallback(
        (word: WordData): boolean => {
            for (let i = 0; i < word.word.length; i++) {
                const row =
                    word.direction === "horizontal"
                        ? word.start_row
                        : word.start_row + i;
                const col =
                    word.direction === "horizontal"
                        ? word.start_col + i
                        : word.start_col;
                const key = `${row}-${col}`;
                const cell = cellData.get(key);
                if (
                    !cell ||
                    cell.value.toLowerCase() !==
                    crosswordGrid[row][col].toLowerCase()
                ) {
                    return false;
                }
            }
            return true;
        },
        [cellData, crosswordGrid],
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const newCompletedWords = metadata
            .filter(isWordComplete)
            .map((word) => `${word.start_row}-${word.start_col}`)
            .filter((wordKey) => !completedWords.includes(wordKey));

        if (newCompletedWords.length > 0) {
            setCompletedWords((prevCompleted) => [
                ...prevCompleted,
                ...newCompletedWords,
            ]);

            // Automatically select the next word after completing one
            if (
                selectedWord &&
                newCompletedWords.includes(
                    `${selectedWord.start_row}-${selectedWord.start_col}`,
                )
            ) {
                const nextWord = findNextWord(selectedWord);
                if (nextWord) {
                    setSelectedWord(nextWord);
                    // And focus its first cell
                    const firstCellKey = `${nextWord.start_row}-${nextWord.start_col}`;
                    inputRefs.current[firstCellKey]?.focus();
                }
            }
        }
    }, [metadata, isWordComplete, completedWords, selectedWord]);

    const handleInputChange = (
        rowIndex: number,
        colIndex: number,
        value: string,
    ) => {
        const key = `${rowIndex}-${colIndex}`;
        const correctValue = crosswordGrid[rowIndex][colIndex];

        setCellData(prevCellData => {
            const newCellData = new Map(prevCellData);
            const newCellState =
                value.toLowerCase() === correctValue.toLowerCase()
                    ? CellState.Correct
                    : value === "" ? CellState.Empty : CellState.Incorrect;
            newCellData.set(key, { value, state: newCellState });
            return newCellData;
        });

        if (value.toLowerCase() === correctValue.toLowerCase() && value !== "") {
            focusNextCell(rowIndex, colIndex);
        }
    };

    const focusNextCell = (row: number, col: number) => {
        const currentWord = metadata.find((word) => {
            if (word.direction === "horizontal") {
                return (
                    row === word.start_row &&
                    col >= word.start_col &&
                    col < word.start_col + word.word.length
                );
            }
            return (
                col === word.start_col &&
                row >= word.start_row &&
                row < word.start_row + word.word.length
            );
        });

        if (!currentWord) return;

        let nextRow = row;
        let nextCol = col;

        if (currentWord.direction === "horizontal") {
            nextCol++;
            if (nextCol >= currentWord.start_col + currentWord.word.length) {
                const nextWord = findNextWord(currentWord);
                if (nextWord) {
                    nextRow = nextWord.start_row;
                    nextCol = nextWord.start_col;
                } else {
                    return;
                }
            }
        } else {
            nextRow++;
            if (nextRow >= currentWord.start_row + currentWord.word.length) {
                const nextWord = findNextWord(currentWord);
                if (nextWord) {
                    nextRow = nextWord.start_row;
                    nextCol = nextWord.start_col;
                } else {
                    return;
                }
            }
        }

        const nextKey = `${nextRow}-${nextCol}`;
        const nextInput = inputRefs.current[nextKey];

        if (nextInput && crosswordGrid[nextRow][nextCol] !== "#") {
            nextInput.focus();
        } else {
            focusNextCell(nextRow, nextCol);
        }
    };

    const findNextWord = useCallback(
        (currentWord: WordData): WordData | undefined => {
            const sortedWords = [...metadata].sort((a, b) => {
                if (a.start_row !== b.start_row) {
                    return a.start_row - b.start_row;
                }
                return a.start_col - b.start_col;
            });

            const currentIndex = sortedWords.indexOf(currentWord);
            if (currentIndex === -1 || currentIndex === sortedWords.length - 1) {
                return undefined; // Current word not found or is the last word
            }
            return sortedWords[currentIndex + 1];
        },
        [metadata],
    );

    const handleClueClick = (word: WordData) => {
        setSelectedWord(word);
        const firstCellKey = `${word.start_row}-${word.start_col}`;
        inputRefs.current[firstCellKey]?.focus();
    };

    const handleCellClick = (row: number, col: number) => {
        const word = metadata.find(
            (w) =>
                (w.direction === "horizontal" &&
                    w.start_row === row &&
                    col >= w.start_col &&
                    col < w.start_col + w.word.length) ||
                (w.direction === "vertical" &&
                    w.start_col === col &&
                    row >= w.start_row &&
                    row < w.start_row + w.word.length),
        );

        if (word) {
            setSelectedWord(word);
        }
    };
    return {
        cellData,
        completedWords,
        inputRefs,
        clueListRef,
        selectedWord,
        getCellNumbers,
        handleInputChange,
        handleClueClick,
        handleCellClick,
    };
};
