import { useState, useEffect } from 'react';
import axios from 'axios';

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
  title: string,
  crossword_id: string
}

function App() {
  const [crosswordData, setCrosswordData] = useState<Crosswords[] | null>(null);


  useEffect(() => {
    if (!crosswordData) {

      axios.get<Crosswords[]>('http://localhost:5001/crossword')
        .then(response => {
          setCrosswordData(response.data);
        })
        .catch(error => {
          console.error("Error fetching crossword data:", error);
        });
    }
  }, [crosswordData]);


  if (!crosswordData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {
        crosswordData.map((crossword) => {
          return <div key={crossword.crossword_id}>
            <h3>{crossword.title}</h3>
          </div>
        })

      }
    </div>
  );
}

export default App;