interface StartPos {
	x: number;
	y: number;
	word: string;
	direction: 'across' | 'down';
}

class CrosswordGenerator {
	private board: (string | null)[][];
	private wordArr: string[];
	private wordBank: WordObj[];
	private wordsActive: WordObj[];
	private bounds: Bounds;
	public startPos: StartPos[];
	constructor() {
		this.board = [];
		this.wordArr = [];
		this.wordBank = [];
		this.wordsActive = [];
		this.bounds = new Bounds();
		this.startPos = [];
	}

	public generateCrossword(words: string[]): string[][] | null {
		this.wordArr = words;
		// Clear stat
		this.cleanState();

		for (let i = 0; i < 10; i++) {
			this.cleanState();
			// console.log("populated", this.populateBoard())
			if (this.populateBoard()) {
				// console.log("boar", this.boardToArrays())

				return this.boardToArrays();
			}
		}

	}

	private boardToArrays(): string[][] {
		const crossword: string[][] = [];
		for (let i = this.bounds.top - 1; i < this.bounds.bottom + 2; i++) {
			const row: string[] = [];
			for (let j = this.bounds.left - 1; j < this.bounds.right + 2; j++) {
				row.push(this.board[j][i] || "#");
			}
			crossword.push(row);
		}
		// console.log(crossword)
		return crossword;
	}

	private cleanState(): void {
		this.bounds.clean();
		this.wordBank = [];
		this.wordsActive = [];
		this.board = [];
		this.startPos = [];

		for (let i = 0; i < 32; i++) {
			this.board.push([]);
			for (let j = 0; j < 32; j++) {
				this.board[i].push(null);
			}
		}
	}

	private populateBoard(): boolean {
		this.prepareBoard();
		this.wordBank.sort((a, b) => b.string.length - a.string.length);
		if (this.wordBank.length > 0) {
			this.placeFirstWord();
		}

		for (let i = 0; i < this.wordBank.length; i++) {
			console.log(i)
			if (!this.addWordToBoard(this.wordBank[i])) {
				if(this.board.length < 3)
				return false;
			}
		}
		return true;
	}

	private placeFirstWord() {
		const firstWord = this.wordBank.shift();
		if (firstWord) {
			const x = 16;
			const y = 16;
			const dir = 0; //across

			firstWord.x = x;
			firstWord.y = y;
			firstWord.dir = dir;

			this.wordsActive.push(firstWord);
			this.startPos.push({ x, y, direction: 'across', word: firstWord.string });

			for (let i = 0; i < firstWord.char.length; i++) {
				const currentX = x + i;
				this.board[currentX][y] = firstWord.char[i];
				this.bounds.update(currentX, y)
			}
		}
	}

	private prepareBoard(): void {
		this.wordBank = this.wordArr.map((word) => new WordObj(word));

		for (const wA of this.wordBank) {
			for (const cA of wA.char) {
				for (const wB of this.wordBank) {
					if (wA !== wB) {
						for (const cB of wB.char) {
							if (cA === cB) {
								wA.totalMatches++;
							}
						}
					}
				}
			}
		}
	}
	private addWordToBoard(wordToPlace: WordObj): boolean {
		let bestPlacement: { x: number, y: number, direction: 0 | 1, intersection: number } | null = null;

		for (const activeWord of this.wordsActive) {
			for (let i = 0; i < activeWord.char.length; i++) {
				const activeChar = activeWord.char[i];
				const activeX = activeWord.x + (activeWord.dir === 0 ? i : 0);
				const activeY = activeWord.y + (activeWord.dir === 1 ? i : 0);

				const intersection = wordToPlace.char.findIndex(char => char === activeChar);

				if (intersection !== -1) {
					const placement = this.getPotentialPlacement(wordToPlace, activeX, activeY, intersection, activeWord.dir === 0 ? 1 : 0);
					if (placement && (bestPlacement === null || placement.intersection > bestPlacement.intersection)) {
						bestPlacement = placement;
					}
				}
			}
		}

		if (!bestPlacement) {
			return false;
		}

		wordToPlace.x = bestPlacement.x;
		wordToPlace.y = bestPlacement.y;
		wordToPlace.dir = bestPlacement.direction;
		this.wordsActive.push(wordToPlace);
		this.startPos.push({
			x: bestPlacement.x,
			y: bestPlacement.y,
			direction: bestPlacement.direction === 0 ? 'across' : 'down',
			word: wordToPlace.string
		});

		for (let i = 0; i < wordToPlace.char.length; i++) {
			const x = bestPlacement.x + (bestPlacement.direction === 0 ? i : 0);
			const y = bestPlacement.y + (bestPlacement.direction === 1 ? i : 0);
			this.board[x][y] = wordToPlace.char[i];
			this.bounds.update(x, y);
		}

		return true;
	}

	private getPotentialPlacement(word: WordObj, intersectX: number, intersectY: number, intersectIndex: number, direction: 0 | 1): { x: number, y: number, direction: 0 | 1, intersection: number } | null {
		const startX = intersectX - (direction === 0 ? 0 : intersectIndex);
		const startY = intersectY - (direction === 1 ? 0 : intersectIndex);
		let intersection = 0;

		if (startX < 0 || startY < 0 || startX + (direction === 0 ? word.char.length : 0) > 31 || startY + (direction === 1 ? word.char.length : 0) > 31) {
			return null;
		}

		for (let i = 0; i < word.char.length; i++) {
			const x = startX + (direction === 0 ? i : 0);
			const y = startY + (direction === 1 ? i : 0);

			if (this.board[x][y] !== null && this.board[x][y] !== word.char[i]) {
				return null; // Collision
			}

			if (this.board[x][y] === word.char[i]) {
				intersection++;
			}

			// Check for neighboring letters
			const neighbors = [
				{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, // Above and below
				{ dx: -1, dy: 0 }, { dx: 1, dy: 0 }, // Left and right
			];
			for (const neighbor of neighbors) {
				const nx = x + neighbor.dx;
				const ny = y + neighbor.dy;
				if (this.board[nx]?.[ny] !== undefined && this.board[nx]?.[ny] !== null) {
					if (i === intersectIndex && !(nx === intersectX && ny === intersectY)) {
						return null;
						// biome-ignore lint/style/noUselessElse: <explanation>
					} else if (i !== intersectIndex && (nx !== intersectX && ny !== intersectY)) {
						return null;
					}
				}
			}
		}

		return { x: startX, y: startY, direction, intersection };
	}
}

class Bounds {
	top: number;
	right: number;
	bottom: number;
	left: number;

	constructor() {
		this.top = 0;
		this.right = 0;
		this.bottom = 0;
		this.left = 0;
	}

	update(x: number, y: number): void {
		this.top = Math.min(y, this.top);
		this.right = Math.max(x, this.right);
		this.bottom = Math.max(y, this.bottom);
		this.left = Math.min(x, this.left);
	}

	clean(): void {
		this.top = 999;
		this.right = 0;
		this.bottom = 0;
		this.left = 999;
	}
}

class WordObj {
	string: string;
	char: string[];
	totalMatches: number;
	effectiveMatches: number;
	successfulMatches: { x: number; y: number; dir: number }[];
	x: number;
	y: number;
	dir: 0 | 1;

	constructor(stringValue: string) {
		this.string = stringValue;
		this.char = stringValue.split("");
		this.totalMatches = 0;
		this.effectiveMatches = 0;
		this.successfulMatches = [];
		this.x = 0;
		this.y = 0;
		this.dir = 0;
	}
}

export default CrosswordGenerator;
