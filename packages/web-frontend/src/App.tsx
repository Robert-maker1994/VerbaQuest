import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Position {
  x: number;
  y: number;
}

interface CrosswordMetadata {
  startPos: Position & { direction: "across" | "down" }; // Added direction
  word: string;
  clue: string;
}

interface CrosswordData {
  metadata: CrosswordMetadata[];
  crossword: string[][];
  title: string;
}

interface Cell {
  value: string;
  isBlackSquare: boolean;
}

// --- Component ---

function App() {
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<Position>({ x: -1, y: -1 });
  const inputRefs = useRef<Record<number, Record<number, HTMLInputElement | null>>>({});

  useEffect(() => {
    // Fetch data from the API
    axios.get('http://localhost:3000/crossword?id=2')
      .then(response => {
        const data: CrosswordData = response.data;
        setCrosswordData(data);

        // Initialize the grid
        if (data) {
          const initialGrid: Cell[][] = data.crossword.map(row =>
            row.map(cell => ({
              value: cell,
              isBlackSquare: cell === "",
            }))
          );
          setGrid(initialGrid);
        }
      })
      .catch(error => {
        console.error("Error fetching crossword data:", error);
      });
  }, []);

  const handleCellClick = (x: number, y: number) => {
    setSelectedCell({ x, y });
    if (inputRefs.current[y] && inputRefs.current[y][x]) {
      inputRefs.current[y][x]!.focus(); // Assert non-null with !
    }
  };

  const handleInputChange = (x: number, y: number, value: string) => {
    const upperValue = value.slice(0, 1).toUpperCase();

    const newGrid = grid.map((row, rowIndex) =>
      rowIndex === y
        ? row.map((cell, colIndex) =>
          colIndex === x ? { ...cell, value: upperValue } : cell
        )
        : row
    );
    setGrid(newGrid);
    setSelectedCell({ x, y });
  };

  if (!crosswordData) {
    return <div>Loading...</div>;
  }

  const { title } = crosswordData;

  return (
    <div>
      <h2>{title}</h2>
      <div className="crossword-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${grid[0]?.length || 0}, 30px)` }}>
        {grid.map((row, y) =>
          row.map((cell, x) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
              key={`${x}-${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
y}`}
              className={`crossword-cell ${cell.isBlackSquare ? 'black-square' : ''} ${selectedCell.x === x && selectedCell.y === y ? 'selected' : ''}`}
              onClick={() => !cell.isBlackSquare && handleCellClick(x, y)}
              style={{
                width: '30px',
                height: '30px',
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: cell.isBlackSquare ? 'black' : 'white',
                cursor: cell.isBlackSquare ? 'default' : 'pointer',
              }}
            >
              {!cell.isBlackSquare && (
                <input
                  type="text"
                  ref={(el) => {
                    if (!inputRefs.current[y]) {
                      inputRefs.current[y] = {};
                    }
                    inputRefs.current[y][x] = el;
                  }}
                  value={cell.value}
                  onChange={(e) => handleInputChange(x, y, e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    outline: 'none',
                    background: 'transparent',
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;