import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { WordData } from "../../../interfaces";

export interface CellData {
    value: string;
    state: CellState;
}
export enum CellState {
    Correct = 0,
    Incorrect = 1,
    Empty = 2,
    Partial = 3,
}
interface UseCrosswordGridProps {
    crosswordGrid: string[][];
    metadata: WordData[];
}


interface UseCrosswordGridReturn {
    cellData: Map<string, CellData>;
    selectedWord: WordData | null;
    inputRefs: RefObject<{ [key: string]: HTMLInputElement | null }>;
    clueListRef: React.RefObject<HTMLDivElement | null>;
    getCellNumbers: (row: number, col: number) => number[] | null;
    handleClueClick: (word: WordData) => void;
    handleCellClick: (row: number, col: number) => void;
    handleKeyDown: (row: number, col: number, event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const useCrosswordGrid = ({
    crosswordGrid,
    metadata,
}: UseCrosswordGridProps): UseCrosswordGridReturn => {
    const [cellData, setCellData] = useState<Map<string, CellData>>(new Map());
    const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
    const inputRefs: RefObject<{ [key: string]: HTMLInputElement | null }> = useRef({});
    const clueListRef = useRef<HTMLDivElement>(null);

    const getCellNumbers = useCallback(
        (row: number, col: number): number[] | null => {
            const words = metadata.filter((item) => {
                return (
                    item.start_row === row && item.start_col === col
                );
            });
            if (words.length === 0) return null;

            return words.map((word) => metadata.findIndex((w) => w.word_id === word.word_id) + 1);
        },
        [metadata],
    );
    useEffect(() => {
        if (selectedWord && clueListRef.current) {
            const selectedClueElement = clueListRef.current.querySelector(
                `[data-word-key="${selectedWord.word_id}"]`,
            );
            if (selectedClueElement) {
                selectedClueElement.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        }
    }, [selectedWord]);

    const findNextWord = useCallback(
        (currentWord: WordData): WordData | undefined => {
            const sortedWords = [...metadata].sort((a, b) => {
                if (a.start_row !== b.start_row) {
                    return a.start_row - b.start_row;
                }
                return a.start_col - b.start_col;
            });

            const currentIndex = sortedWords.findIndex(w => w.word_id === currentWord.word_id);
            if (currentIndex === -1 || currentIndex === sortedWords.length - 1) {
                return undefined; // Current word not found or is the last word
            }
            return sortedWords[currentIndex + 1];
        },
        [metadata],
    );

    const findPreviousWord = useCallback(
        (currentWord: WordData): WordData | undefined => {
            const sortedWords = [...metadata].sort((a, b) => {
                if (a.start_row !== b.start_row) {
                    return a.start_row - b.start_row;
                }
                return a.start_col - b.start_col;
            });

            const currentIndex = sortedWords.findIndex(w => w.word_id === currentWord.word_id);
            if (currentIndex === -1 || currentIndex === 0) {
                return undefined; // Current word not found or is the first word
            }
            return sortedWords[currentIndex - 1];
        },
        [metadata],
    );


    const handleClueClick = (word: WordData) => {
        setSelectedWord(word);
        handleInputFocus(word.start_row, word.start_col)
    };

    const handleCellClick = (row: number, col: number) => {
        const word = metadata.find((w) => {
            if (w.direction === "horizontal") {
                return (row === w.start_row && col >= w.start_col && col < w.start_col + w.word.length);
            }

            return (col === w.start_col && row >= w.start_row && row < w.start_row + w.word.length);

        });
        if (word) {
            setSelectedWord(word);
        }
    };


    const handleKeyDown = (row: number, col: number, event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const key = `${row}-${col}`;
        if (!event?.key) {
            return
        }

        if (!selectedWord) return;
        const correctValue = crosswordGrid[row][col];
        const currentCellData = cellData.get(key);

        let nextRow = row;
        let nextCol = col;
        switch (event.key) {
            case "ArrowUp":
                event.preventDefault();
                nextRow--;
                if (nextRow < 0) {
                    return; // Prevent moving above the grid
                }
                handleCellClick(nextRow, nextCol)
                break;
            case "ArrowDown":
                event.preventDefault();
                nextRow++;
                if (nextRow >= crosswordGrid.length) {
                    return; // Prevent moving below the grid
                }
                handleCellClick(nextRow, nextCol)

                break;
            case "ArrowLeft":
                event.preventDefault();
                nextCol--;
                if (nextCol < 0) {
                    return; // Prevent moving to the left of the grid
                }
                handleCellClick(nextRow, nextCol)

                break;
            case "ArrowRight":
                event.preventDefault();
                nextCol++;
                if (nextCol >= crosswordGrid[0].length) {
                    return; // Prevent moving to the right of the grid
                }
                handleCellClick(nextRow, nextCol)

                break;
            case "Backspace":
                event.preventDefault();
                if (currentCellData?.value !== "") {
                    setCellData(prevCellData => {
                        const newCellData = new Map(prevCellData);

                        newCellData.set(key, { value: "", state: CellState.Empty });
                        return newCellData;
                    });
                } else {
                    if (selectedWord.direction === "horizontal") {
                        nextCol--;

                        if (nextCol < selectedWord.start_col) {
                            const nextWord = findPreviousWord(selectedWord);
                            if (nextWord) {
                                nextRow = nextWord.start_row;
                                nextCol = nextWord.start_col + nextWord.word.length - 1;

                            }
                            else {
                                return;
                            }
                        }
                    }
                    else {
                        nextRow--;
                        if (nextRow < selectedWord.start_row) {
                            const nextWord = findPreviousWord(selectedWord);
                            if (nextWord) {
                                nextRow = nextWord.start_row + nextWord.word.length - 1;
                                nextCol = nextWord.start_col;
                            } else {
                                return;
                            }
                        }
                    }
                    handleInputFocus(nextRow, nextCol)

                }
                return;
            default:
                if (/^[a-zA-Z]$/.test(event.key)) {
                    const value = event.key.toLocaleLowerCase();

                    setCellData(prevCellData => {
                        const newCellData = new Map(prevCellData);
                        let newCellState = CellState.Incorrect;

                        // This catches Ñ 
                        if (value.localeCompare(correctValue, "en", { sensitivity: "base" }) === 0) {
                            newCellState = CellState.Partial
                        }

                        if (value === correctValue) {
                            newCellState = CellState.Correct
                        }

                        newCellData.set(key, { value, state: newCellState });
                        return newCellData;
                    });
                    if (value === correctValue) {
                        if (selectedWord.direction === "horizontal") {
                            nextCol++;
                            if (nextCol >= selectedWord.start_col + selectedWord.word.length) {
                                const nextWord = findNextWord(selectedWord);

                                if (nextWord) {
                                    nextRow = nextWord.start_row;
                                    nextCol = nextWord.start_col;
                                } else {
                                    return;
                                }
                            }
                        } else {
                            nextRow++;
                            if (nextRow >= selectedWord.start_row + selectedWord.word.length) {
                                const nextWord = findNextWord(selectedWord);
                                if (nextWord) {
                                    nextRow = nextWord.start_row;
                                    nextCol = nextWord.start_col;
                                } else {
                                    return;
                                }
                            }

                        }
                        handleInputFocus(nextRow, nextCol)
                    }

                }
                return;
        }
        handleInputFocus(nextRow, nextCol)
    };

    function handleInputFocus(nextRow: number, nextCol: number) {
        const nextKey = `${nextRow}-${nextCol}`;

        const nextInput = inputRefs.current[nextKey];

        if (nextInput && crosswordGrid[nextRow][nextCol] !== "#") {
            nextInput.focus();
        }

    }

    return {
        cellData,
        inputRefs,
        clueListRef,
        selectedWord,
        getCellNumbers,
        handleClueClick,
        handleCellClick,
        handleKeyDown,
    };
};
