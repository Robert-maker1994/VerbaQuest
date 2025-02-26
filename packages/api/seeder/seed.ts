import { AppDataSource } from "../datasource";
import {
	Crossword,
	CrosswordWord,
	LanguageCode,
	LanguageName,
	Languages,
	Topic,
	Words,
} from "../libs/entity";

export async function seed() {
	await AppDataSource.initialize();

	const languageRepository = AppDataSource.getRepository(Languages);
	const wordsRepository = AppDataSource.getRepository(Words);
	const topicsRepository = AppDataSource.getRepository(Topic);
	const crosswordWordsRepository = AppDataSource.getRepository(CrosswordWord);
	const crosswordsRepository = AppDataSource.getRepository(Crossword);

	// Insert languages
	const languages = [
		{
			language_code: LanguageCode.English,
			language_name: LanguageName.English,
		},
		{
			language_code: LanguageCode.SPANISH,
			language_name: LanguageName.SPANISH,
		},
	];
	await languageRepository.save(languages);

	// Insert words
	const words = [
		{ word_text: "Lunes", definition: "Monday", language: languages[1] },
		{
			word_text: "Tarjeta roja",
			definition: "Red card",
			language: languages[1],
		},
		{
			word_text: "Tarjeta amarilla",
			definition: "Yellow card",
			language: languages[1],
		},
		{
			word_text: "Fuera de juego",
			definition: "Offside",
			language: languages[1],
		},
		{ word_text: "Córner", definition: "Corner kick", language: languages[1] },
		{
			word_text: "Tiro libre",
			definition: "Free kick",
			language: languages[1],
		},
		{ word_text: "Cabezazo", definition: "Header", language: languages[1] },
		{ word_text: "Pase", definition: "Pass", language: languages[1] },
		{ word_text: "Regate", definition: "Dribble", language: languages[1] },
		{ word_text: "Entrada", definition: "Tackle", language: languages[1] },
		{
			word_text: "Tiempo añadido",
			definition: "Injury time/Added time",
			language: languages[1],
		},
		{ word_text: "Árbitro", definition: "Referee", language: languages[1] },
		{ word_text: "Estadio", definition: "Stadium", language: languages[1] },
	];
	await wordsRepository.save(words);

	// Insert topics
	const topics = [
		{ topic_name: "Días de la semana", language: languages[1] },
		{ topic_name: "Fútbol", language: languages[1] },
	];
	await topicsRepository.save(topics);

	// Insert crosswords
	const crosswords = [
		{ title: "Weekdays", language: languages[1], difficulty: 1 },
		{ title: "Football Terms", language: languages[1], difficulty: 2 },
	];
	await crosswordsRepository.save(crosswords);

	// Insert crossword words
	const crosswordWords = [
		{ crossword: crosswords[0], word: words[0], clue: "Monday" },
		{ crossword: crosswords[0], word: words[1], clue: "Tuesday" },
		{ crossword: crosswords[0], word: words[2], clue: "Wednesday" },
		{ crossword: crosswords[0], word: words[3], clue: "Thursday" },
		{ crossword: crosswords[0], word: words[4], clue: "Friday" },
		{ crossword: crosswords[0], word: words[5], clue: "Saturday" },
		{ crossword: crosswords[0], word: words[6], clue: "Sunday" },
		{ crossword: crosswords[1], word: words[7], clue: "Football" },
		{ crossword: crosswords[1], word: words[8], clue: "Goalkeeper" },
		{ crossword: crosswords[1], word: words[9], clue: "Defender" },
		{ crossword: crosswords[1], word: words[10], clue: "Midfielder" },
		{ crossword: crosswords[1], word: words[11], clue: "Forward/Striker" },
		{ crossword: crosswords[1], word: words[12], clue: "Stadium" },
	];
	await crosswordWordsRepository.save(crosswordWords);

	console.log("Seeding completed!");

	await AppDataSource.destroy();
}
