import { isPast, endOfDay } from "date-fns";
import { useState, useEffect } from "react";
import backendEndpoints from "../../../context/api/api";
import { CellState } from "../../crossword/interface";

const loadStateFromLocalStorage = async (gridSize = 5): Promise<WordleState | null> => {
    const storedState = localStorage.getItem("wordleState");
    if (storedState) {
        const state: WordleState = JSON.parse(storedState);
        if (!isPast(new Date(state.expiryDate))) {
            return state;
        }
        localStorage.clear();
    }
    const words = await backendEndpoints.getWorldWord();

    const state: WordleState = {
        guesses: Array.from({ length: gridSize }, () => ({
            word: "",
            evaluation: Array(gridSize).fill(CellState.Empty),
        })),
        words,
        targetWord: words[Math.floor(Math.random() * words.length)],
        currentRow: 0,
        gameStatus: "playing",
        expiryDate: endOfDay(new Date()).toISOString()
    };
    localStorage.setItem("wordleState", JSON.stringify(state));
    return state;

};

interface Guess {
    word: string;
    evaluation: CellState[];
}

export type GameStatus = "playing" | "won" | "lost";


interface WordleState {
    guesses: Guess[];
    currentRow: number;
    targetWord: string;
    words: string[]
    gameStatus: GameStatus;
    expiryDate: string;
}


export const useWordle = () => {
    const gridSize = 5;

    const [targetWord, setTargetWord] = useState<string | null>(null);
    const [guesses, setGuesses] = useState<Guess[]>([]);
    const [words, setWords] = useState<string[]>([]);
    const [currentRow, setCurrentRow] = useState(0);
    const [message, setMessage] = useState("");
    const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
    const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);

    const saveStateToLocalStorage = (state: Partial<WordleState>) => {
        const currentState = loadStateFromLocalStorage();
        currentState.then((res) => {
            const newState = { ...res, ...state };
            localStorage.setItem("wordleState", JSON.stringify(newState));
        })
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        saveStateToLocalStorage({ guesses, currentRow, gameStatus });
    }, [guesses, currentRow, gameStatus]);

    useEffect(() => {
        loadStateFromLocalStorage().then((storedWord) => {
            if (storedWord) {
                setGuesses(storedWord.guesses);
                setCurrentRow(storedWord.currentRow);
                setGameStatus(storedWord.gameStatus);
                setTargetWord(storedWord.targetWord);
                setWords(storedWord.words);
            }
        }).catch((error) => {
            console.error("Error fetching word:", error);
            setMessage("Error fetching word. Please try again later.");
        });

    }, []);

    const evaluateGuess = (guess: string): CellState[] => {
        if (!targetWord) {
            return Array(gridSize).fill(CellState.Empty);
        }

        const target = targetWord.toLowerCase();
        const result: CellState[] = Array(gridSize).fill(CellState.Incorrect);
        const targetLetters = target.split("");

        for (let i = 0; i < gridSize; i++) {
            if (guess[i] === target[i]) {
                result[i] = CellState.Correct;
                targetLetters[targetLetters.indexOf(guess[i])] = "";
            }
        }

        for (let i = 0; i < gridSize; i++) {
            if (result[i] !== CellState.Correct && targetLetters.includes(guess[i])) {
                result[i] = CellState.Partial;
                targetLetters[targetLetters.indexOf(guess[i])] = "";

            }
        }

        return result;
    };

    const handleGuessSubmit = () => {
        if (!targetWord) return;
        const guess = guesses[currentRow]?.word.toUpperCase() || "";

        if (guess.length !== gridSize) {
            setMessage("Guess must be 5 letters long.");
            return;
        }



        const validWord = words.includes(guess);

        if (!validWord) {
            setMessage("Invalid Word. Please try again.");
            return;
        }

        const evaluation = evaluateGuess(guess.toLowerCase());
        const updatedGuesses = [...guesses];
        updatedGuesses[currentRow] = { word: guess, evaluation };
        setGuesses(
            guesses.map((g, i) =>
                i === currentRow
                    ? { ...g, evaluation: evaluation, word: guesses[currentRow].word } // Update both evaluation and word
                    : g
            )
        );
        if (guess.toLowerCase() === targetWord.toLowerCase()) {
            setGameStatus("won");
            setMessage("Congratulations! You won!");
        } else if (currentRow === gridSize - 1) {
            setGameStatus("lost");
            setMessage(`You lost! The word was ${targetWord}`);
        } else {
            setCurrentRow(currentRow + 1);
            setActiveCell({ row: currentRow + 1, col: 0 });
        }
    };
    const handleKeyPress = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (!targetWord || activeCell === null) return;
        const { row, col } = activeCell;

        if (event.key === "Enter") {
            handleGuessSubmit();
        } else if (event.key === "Backspace") {
            const updatedGuess = guesses[row].word.slice(0, col - 1) + guesses[row].word.slice(col);
            setGuesses(guesses.map((g, i) => (i === row ? { ...g, word: updatedGuess } : g)));
            setActiveCell({ row, col: Math.max(0, col - 1) });
        } else if (/^[a-zA-Z]$/.test(event.key)) {
            const updatedGuess = guesses[row].word.slice(0, col) + event.key.toUpperCase() + guesses[row].word.slice(col + 1);
            setGuesses(guesses.map((g, i) => (i === row ? { ...g, word: updatedGuess } : g)));
            setActiveCell({ row, col: Math.min(gridSize - 1, col + 1) });
        }
    };

    const handleCellClick = (row: number, col: number) => {
        if (row <= currentRow) {
            setActiveCell({ row, col });
        }
    };


    return {
        guesses,
        currentRow,
        message,
        gameStatus,
        handleKeyPress,
        handleCellClick,
        activeCell
    };
};
