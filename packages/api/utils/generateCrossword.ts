interface WordData {
	word: string;
	start_row: number;
	start_col: number;
	direction: "horizontal" | "vertical";
}

interface CrosswordMetadata {
	words_data: WordData[];
}

type CrosswordGrid = string[][];

// Helper function to shuffle an array (Fisher-Yates shuffle)
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
 * Generates a crossword grid and metadata for a given list of words with randomization.
 *
 * Args:
 *     words: A list of strings representing the words for the crossword.
 *
 * Returns:
 *     A tuple containing:
 *       - crossword_grid: A 2D list of characters representing the crossword grid.
 *       - metadata: A dictionary containing metadata about the crossword.
 */
export function generateCrossword(
	words: string[],
): [CrosswordGrid, CrosswordMetadata] {
	if (!words || words.length === 0) {
		return [[], { words_data: [] }];
	}

	const grid_size: number = 15;
	const crossword_grid: CrosswordGrid = Array(grid_size)
		.fill(null)
		.map(() => Array(grid_size).fill("#"));
	const placed_words_data: WordData[] = [];

	// 1. Shuffle the words array to randomize word placement order
	const shuffled_words: string[] = shuffleArray(words);

	// 2. Place the first word (from shuffled list) horizontally in the center
	const first_word: string = shuffled_words[0];
	const start_row: number = Math.floor(grid_size / 2);
	let start_col: number = Math.floor((grid_size - first_word.length) / 2);
	if (start_col < 0) start_col = 0;
	for (let i = 0; i < first_word.length; i++) {
		crossword_grid[start_row][start_col + i] = first_word[i];
	}
	placed_words_data.push({
		word: first_word,
		start_row: start_row,
		start_col: start_col,
		direction: "horizontal",
	});

	for (let word_index = 1; word_index < shuffled_words.length; word_index++) {
		const current_word: string = shuffled_words[word_index];
		let placed = false;
		const possible_placements: PossiblePlacement[] = [];

		for (const placed_word_info of placed_words_data) {
			for (
				let current_word_index = 0;
				current_word_index < current_word.length;
				current_word_index++
			) {
				const current_char: string = current_word[current_word_index];
				for (
					let placed_word_index = 0;
					placed_word_index < placed_word_info.word.length;
					placed_word_index++
				) {
					const placed_char: string = placed_word_info.word[placed_word_index];
					if (current_char === placed_char) {
						// Check horizontal placement
						if (placed_word_info.direction === "vertical") {
							const start_row_current: number =
								placed_word_info.start_row + placed_word_index;
							const start_col_current: number =
								placed_word_info.start_col - current_word_index;
							if (
								start_col_current >= 0 &&
								start_col_current + current_word.length <= grid_size
							) {
								let valid_horizontal = true;
								for (
									let i_check = 0;
									i_check < current_word.length;
									i_check++
								) {
									const grid_char: string =
										crossword_grid[start_row_current][
											start_col_current + i_check
										];
									if (
										grid_char !== "#" &&
										grid_char !== current_word[i_check]
									) {
										valid_horizontal = false;
										break;
									}
								}
								if (valid_horizontal) {
									possible_placements.push({
										direction: "horizontal",
										start_row: start_row_current,
										start_col: start_col_current,
										intersection_placed_word_index: placed_word_index,
										intersection_current_word_index: current_word_index,
									});
								}
							}
						}

						// Check vertical placement
						if (placed_word_info.direction === "horizontal") {
							const start_row_current: number =
								placed_word_info.start_row - current_word_index;
							const start_col_current: number =
								placed_word_info.start_col + placed_word_index;
							if (
								start_row_current >= 0 &&
								start_row_current + current_word.length <= grid_size
							) {
								let valid_vertical = true;
								for (
									let i_check = 0;
									i_check < current_word.length;
									i_check++
								) {
									const grid_char: string =
										crossword_grid[start_row_current + i_check][
											start_col_current
										];
									if (
										grid_char !== "#" &&
										grid_char !== current_word[i_check]
									) {
										valid_vertical = false;
										break;
									}
								}
								if (valid_vertical) {
									possible_placements.push({
										direction: "vertical",
										start_row: start_row_current,
										start_col: start_col_current,
										intersection_placed_word_index: placed_word_index,
										intersection_current_word_index: current_word_index,
									});
								}
							}
						}
					}
				}
			}
		}

		if (possible_placements.length > 0) {
			const chosen_placement =
				possible_placements[
					Math.floor(Math.random() * possible_placements.length)
				];
			const { direction, start_row, start_col } = chosen_placement;

			if (direction === "horizontal") {
				for (let i_place = 0; i_place < current_word.length; i_place++) {
					crossword_grid[start_row][start_col + i_place] =
						current_word[i_place];
				}
			} else {
				for (let i_place = 0; i_place < current_word.length; i_place++) {
					crossword_grid[start_row + i_place][start_col] =
						current_word[i_place];
				}
			}

			placed_words_data.push({
				word: current_word,
				start_row: start_row,
				start_col: start_col,
				direction: direction,
			});
			placed = true;
		}
	}

	const metadata: CrosswordMetadata = { words_data: placed_words_data };
	return [crossword_grid, metadata];
}
