interface WordData {
	word: string;
	start_row: number;
	start_col: number;
	direction: "horizontal" | "vertical";
}

export interface CrosswordMetadata {
	words_data: WordData[];
}

export type CrosswordGrid = string[][];

function shuffleArray<T>(array: T[]): T[] {
	const shuffledArray = [...array];
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
	}
	return shuffledArray;
}

interface PossiblePlacement {
	direction: "horizontal" | "vertical";
	start_row: number;
	start_col: number;
	intersection_placed_word_index: number;
	intersection_current_word_index: number;
}

/**
 * Generates a crossword grid and metadata.
 *
 * @param words - A list of words for the crossword.
 * @returns A tuple: [crossword_grid, metadata].
 */
export function generateCrossword(
	words: string[],
): [CrosswordGrid, CrosswordMetadata] {
	if (!words || words.length === 0) {
		return [[], { words_data: [] }];
	}

	const GRID_SIZE = 15;
	let crosswordGrid: CrosswordGrid = initializeGrid(GRID_SIZE);
	const placedWordsData: WordData[] = [];

	// Shuffle for random word placement.
	const shuffledWords = shuffleArray(words);

	// Place the first word horizontally in the center.
	placeFirstWord(shuffledWords[0], crosswordGrid, placedWordsData);

	// Try to place the remaining words.
	for (let wordIndex = 1; wordIndex < shuffledWords.length; wordIndex++) {
		const currentWord = shuffledWords[wordIndex];
		placeWord(currentWord, crosswordGrid, placedWordsData);
	}

	let metadata: CrosswordMetadata = { words_data: placedWordsData };
	crosswordGrid = removeEmptyRowsAndCols(crosswordGrid);
	metadata = updateMetadata(crosswordGrid, metadata);

	return [crosswordGrid, metadata];
}

/**
 * Initializes the crossword grid with empty cells.
 * @param size The size of the grid (size x size).
 * @returns The initialized grid.
 */
function initializeGrid(size: number): CrosswordGrid {
	return Array(size)
		.fill(null)
		.map(() => Array(size).fill("#"));
}

/**
 * Places the first word horizontally in the center of the grid.
 *
 * @param word - The first word to place.
 * @param grid - The crossword grid.
 * @param placedWords - Array to store metadata of placed words.
 */
function placeFirstWord(
	word: string,
	grid: CrosswordGrid,
	placedWords: WordData[],
): void {
	const startRow = Math.floor(grid.length / 2);
	let startCol = Math.floor((grid.length - word.length) / 2);
	if (startCol < 0) startCol = 0; // ensure startCol is within the grid

	for (let i = 0; i < word.length; i++) {
		grid[startRow][startCol + i] = word[i];
	}

	placedWords.push({
		word,
		start_row: startRow,
		start_col: startCol,
		direction: "horizontal",
	});
}
/**
 * Checks if a word can be placed at the given position and direction.
 *
 * @param grid - The crossword grid.
 * @param word - The word to place.
 * @param startRow - Starting row.
 * @param startCol - Starting column.
 * @param direction - "horizontal" or "vertical".
 * @returns True if the placement is valid, false otherwise.
 */
function isValidPlacement(
	grid: CrosswordGrid,
	word: string,
	startRow: number,
	startCol: number,
	direction: "horizontal" | "vertical",
): boolean {
	const gridSize = grid.length;
	const wordLength = word.length;

	// Check bounds.
	if (direction === "horizontal") {
		if (startCol < 0 || startCol + wordLength > gridSize) return false;
	} else {
		if (startRow < 0 || startRow + wordLength > gridSize) return false;
	}

	// Check for collisions with existing words (only allow intersections at the same letter).
	for (let i = 0; i < wordLength; i++) {
		const row = direction === "horizontal" ? startRow : startRow + i;
		const col = direction === "horizontal" ? startCol + i : startCol;

		if (grid[row][col] !== "#" && grid[row][col] !== word[i]) {
			return false;
		}
	}

	return true;
}

/**
 * Attempts to place a word on the grid, intersecting with existing words.
 * @param currentWord Word to place
 * @param crosswordGrid The crossword grid.
 * @param placedWordsData  Array to store metadata of placed words.
 */
function placeWord(
	currentWord: string,
	crosswordGrid: CrosswordGrid,
	placedWordsData: WordData[],
): void {
	const possiblePlacements: PossiblePlacement[] = [];

	// Find all possible placements for the current word.
	for (const placedWordInfo of placedWordsData) {
		for (
			let currentWordIndex = 0;
			currentWordIndex < currentWord.length;
			currentWordIndex++
		) {
			const currentChar = currentWord[currentWordIndex];
			for (
				let placedWordIndex = 0;
				placedWordIndex < placedWordInfo.word.length;
				placedWordIndex++
			) {
				const placedChar = placedWordInfo.word[placedWordIndex];

				if (currentChar === placedChar) {
					// Calculate potential start positions based on intersection.
					if (placedWordInfo.direction === "vertical") {
						// Try horizontal placement
						const startRowCurrent = placedWordInfo.start_row + placedWordIndex;
						const startColCurrent = placedWordInfo.start_col - currentWordIndex;
						if (
							isValidPlacement(
								crosswordGrid,
								currentWord,
								startRowCurrent,
								startColCurrent,
								"horizontal",
							)
						) {
							possiblePlacements.push({
								direction: "horizontal",
								start_row: startRowCurrent,
								start_col: startColCurrent,
								intersection_placed_word_index: placedWordIndex,
								intersection_current_word_index: currentWordIndex,
							});
						}
					} else {
						// Try vertical placement.
						const startRowCurrent = placedWordInfo.start_row - currentWordIndex;
						const startColCurrent = placedWordInfo.start_col + placedWordIndex;
						if (
							isValidPlacement(
								crosswordGrid,
								currentWord,
								startRowCurrent,
								startColCurrent,
								"vertical",
							)
						) {
							possiblePlacements.push({
								direction: "vertical",
								start_row: startRowCurrent,
								start_col: startColCurrent,
								intersection_placed_word_index: placedWordIndex,
								intersection_current_word_index: currentWordIndex,
							});
						}
					}
				}
			}
		}
	}

	// Shuffle possible placements for randomness.
	shuffleArray(possiblePlacements);

	// Try the possible placements.
	if (possiblePlacements.length > 0) {
		const chosenPlacement = possiblePlacements[0];
		const { direction, start_row, start_col } = chosenPlacement;

		//Place on the grid
		for (let i = 0; i < currentWord.length; i++) {
			if (direction === "horizontal") {
				crosswordGrid[start_row][start_col + i] = currentWord[i];
			} else {
				crosswordGrid[start_row + i][start_col] = currentWord[i];
			}
		}

		placedWordsData.push({
			word: currentWord,
			start_row,
			start_col,
			direction,
		});
	}
}

/**
 * Removes empty rows and columns from the grid.
 *
 * @param grid - The crossword grid.
 * @returns The trimmed grid.
 */
function removeEmptyRowsAndCols(grid: CrosswordGrid): CrosswordGrid {
	let top = 0;
	let bottom = grid.length - 1;
	let left = 0;
	let right = grid[0].length - 1;

	// Find top-most non-empty row
	while (top < grid.length && grid[top].every((cell) => cell === "#")) {
		top++;
	}

	// Find bottom-most non-empty row.
	while (bottom >= top && grid[bottom].every((cell) => cell === "#")) {
		bottom--;
	}

	// Find left-most non-empty column.
	while (left < grid[0].length && grid.every((row) => row[left] === "#")) {
		left++;
	}

	// Find right-most non-empty column.
	while (right >= left && grid.every((row) => row[right] === "#")) {
		right--;
	}

	// Extract the subgrid based on the found boundaries.
	const newGrid = grid
		.slice(top, bottom + 1)
		.map((row) => row.slice(left, right + 1));
	return newGrid;
}

/**
 * Updates metadata after removing empty rows and cols
 * @param grid current grid state
 * @param metadata metadata to be updated
 * @returns updated metadata
 */
function updateMetadata(
	grid: CrosswordGrid,
	metadata: CrosswordMetadata,
): CrosswordMetadata {
	const updatedMetadata: WordData[] = [];

	for (const wordData of metadata.words_data) {
		let newStartRow = -1;
		let newStartCol = -1;
		let found = false;

		// Search for the new start position of the word in the trimmed grid.
		for (let row = 0; row < grid.length; row++) {
			for (let col = 0; col < grid[row].length; col++) {
				if (grid[row][col] === wordData.word[0]) {
					// Check for the first letter of the word.
					if (wordData.direction === "horizontal") {
						//horizontal
						let match = true;
						for (let i = 0; i < wordData.word.length; i++) {
							if (
								col + i >= grid[row].length ||
								grid[row][col + i] !== wordData.word[i]
							) {
								match = false;
								break;
							}
						}
						if (match) {
							newStartRow = row;
							newStartCol = col;
							found = true;
							break;
						}
					} else {
						//vertical
						let match = true;
						for (let i = 0; i < wordData.word.length; i++) {
							if (
								row + i >= grid.length ||
								grid[row + i][col] !== wordData.word[i]
							) {
								match = false;
								break;
							}
						}
						if (match) {
							newStartRow = row;
							newStartCol = col;
							found = true;
							break;
						}
					}
				}
			}
			if (found) break; // Optimization
		}

		// Add the updated word data if word found.
		if (found) {
			updatedMetadata.push({
				...wordData,
				start_row: newStartRow,
				start_col: newStartCol,
			});
		}
	}

	return { words_data: updatedMetadata };
}
