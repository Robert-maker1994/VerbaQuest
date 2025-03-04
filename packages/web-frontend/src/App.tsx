import { Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import "./crossword.css"
// interface Position {
//   x: number;
//   y: number;
// }

// interface CrosswordMetadata {
//   startPos: Position & { direction: "across" | "down" }; // Added direction
//   word: string;
//   clue: string;
// }

// interface CrosswordData {
//   metadata: CrosswordMetadata[];
//   crossword: string[][];
//   title: string;
// }

// interface Cell {
//   value: string;
//   isBlackSquare: boolean;
// }

interface Crosswords {
	title: string;
	crossword_id: string;

}


interface Metadata {
	startPos: { x: number; y: number };
	word: string;
	clue: string;
}
interface WordData {
	word: string;
	start_row: number;
	start_col: number;
	direction: "horizontal" | "vertical";
}

interface CrosswordMetadata {
	words_data: WordData[];
}

interface CrosswordResponse {
	crossword: string[][];
	title: string;
	metadata: WordData[];
}

function App() {
	const [crosswordData, setCrosswordData] = useState<CrosswordResponse | null>(null);
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
		return <div>Loading...</div>;
	}

	return (
		<div>

			<Crossword crosswordGrid={crosswordData.crossword} metadata={crosswordData.metadata} />

		</div>
	);
}


// interface Metadata {
// 	startPos: { x: number; y: number };
// 	word: string;
// 	clue: string;
// }
// interface CrosswordResponse {
// 	crossword: string[][];
// 	title: string;
// 	metadata: Metadata[];
// }


interface CrosswordProps {
	crosswordGrid: string[][];
	metadata: WordData[];
}

const Crossword: React.FC<CrosswordProps> = ({ crosswordGrid, metadata }) => {
	const [cellValues, setCellValues] = useState<{ [key: string]: string }>({});
	const [correctCells, setCorrectCells] = useState<{ [key: string]: boolean }>({});

	const handleInputChange = (rowIndex: number, colIndex: number, value: string, correctValue: string) => {
		const key = `${rowIndex}-${colIndex}`;
		setCellValues((prevValues) => ({ ...prevValues, [key]: value }));
		setCorrectCells((prevCorrect) => ({ ...prevCorrect, [key]: value.toLocaleLowerCase() === correctValue.toLocaleLowerCase() }));
	};

	const shouldHaveNumber = (rowIndex: number, colIndex: number): number | null => {
		const foundMetadata = metadata.find((item) => {
			return item.start_col === colIndex && item.start_row === rowIndex;
		});

		if (foundMetadata) {
			return metadata.indexOf(foundMetadata) + 1;
		}
		return null;
	};
	return (
		<div className="crossword-container">
			<div className="crossword-grid">
				{crosswordGrid.map((row, rowIndex) => (
					<div key={rowIndex} className="crossword-row">
						{row.map((cell, colIndex) => {
							const key = `${rowIndex}-${colIndex}`;
							if (cell === "#") {
								return <div
									key={colIndex}
									className={"crossword-cell"}
								/>;
							}
							console.log(correctCells[key], correctCells, key,cell , `crossword-cell ${correctCells[key] ? "-correct" : "white"}`)
							return (
								<div
									key={colIndex}
									className={`crossword-cell ${correctCells[key] ? "correct" : "white"}`}
								>
									{shouldHaveNumber(rowIndex, colIndex) !== null && (
										<span className="crossword-number">{shouldHaveNumber(rowIndex, colIndex)}</span>
									)}
									{cell !== "#" && (
										<input
											type="text"
											maxLength={1}
											value={cellValues[key] || ""}
											onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value, cell)}
										/>
									)}
								</div>
							);
						})}
					</div>
				))}

			</div>
		</div>
	);
};
export default App;
