


class Crossword {
    words: string[];
    board: {};
    size: number;
    grid: string[][];
    constructor(words: string[]) {
        this.words = words;
        this.board = {}; // Use an object to represent the board (coordinate -> letter)
        this.size = 15;
        this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(null)); // 2D array representation
    }

    placeWord(word: string, x: number, y: number): boolean {
        let placed = false;
        if (this.canPlaceHorizontal(word, x, y)) {
            for (let i = 0; i < word.length; i++) {
                this.grid[y][x + i] = word[i];
                placed = true;
            }
            if (placed) {
                return placed
            }
        }
        if (this.canPlaceVertical(word, x, y)) {
            for (let i = 0; i < word.length; i++) {
                this.grid[y + i][x] = word[i];

                placed = true;
            }

            if (placed) {
                return placed
            }
        }
        return false
    }

    canPlaceHorizontal(word: string, x: number, y: number) {
        if (x + word.length > this.size) {
            console.log("Horizontal word is out of bounds", word)
            return false; // Check if word exceeds board boundaries
        }

        for (let i = 0; i < word.length; i++) {
            const currentCell = this.grid[y][x + i];
            const aboveCell = this.grid[y - 1][x + i];
            const belowCell = this.grid[y + 1][x + i];

            if (aboveCell !== null || belowCell !== null) {
                console.log("Horizontally the cell has a connecting crossword", "above", aboveCell, "Below", belowCell)

                return false;

            }

            if (currentCell !== null && currentCell !== word[i]) {
                console.log("Horizontally this cell is occupied by", currentCell)
                return false; // Check if cell is occupied by a different letter
            }


        }
        return true; // Word can be placed horizontally
    }

    canPlaceVertical(word: string, x: number, y: number) {
        if (y + word.length > this.size) {
            console.log("Vertical word is out of bounds", word)
            return false; // Check if word exceeds board boundaries
        }

        for (let i = 0; i < word.length; i++) {
            const currentCell = this.grid[y + i][x];
            const previousCell = this.grid[y + i][x];
            const nextToCell = this.grid[y + i][x];
            if (nextToCell !== null || previousCell !== null) {
                console.log("Horizontally the cell has a connecting crossword", "next To Cell", nextToCell, "previous Cell", previousCell)

                return false;

            }
            if (currentCell !== null && currentCell !== word[i]) {
                console.log("Vertically this cell is occupied by", currentCell)

                return false;
            }
        }

        return true; // Word can be placed horizontally
    }

    findIntersections(word: string) {
        throw new Error("Not implemented yet");

    }

    generate() {
        // Implementation of the generation algorithm
    }

    display() {
        for (let i = 0; i < this.size; i++) {
            const row = this.grid[i];
            console.log(row.join("."))

        }
    }
}

export default Crossword;