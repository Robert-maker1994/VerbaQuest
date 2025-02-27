import { AppDataSource } from "../datasource";
import {
	Crossword,
	CrosswordWord,
	LanguageCode,
	LanguageName,
	Languages,
	Topic,
	User,
	Words,
} from "../libs/entity";

export async function seed() {
	await AppDataSource.initialize();

	const languageRepository = AppDataSource.getRepository(Languages);
	const wordsRepository = AppDataSource.getRepository(Words);
	const topicsRepository = AppDataSource.getRepository(Topic);
	const crosswordWordsRepository = AppDataSource.getRepository(CrosswordWord);
	const crosswordsRepository = AppDataSource.getRepository(Crossword);
	const userRepository = AppDataSource.getRepository(User);
	await AppDataSource.query(`CREATE EXTENSION IF NOT EXISTS unaccent;`);

	await userRepository.save([{
		username: "verba",
		password_hash: "test1234",
		email: "verba@gmail.com"
	}])

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
	const wordRepo = await wordsRepository.find();

	// Insert topics
	const topics = [
		{ topic_name: "Días de la semana", language: languages[1] },
		{ topic_name: "Fútbol", language: languages[1] },
	];
	await topicsRepository.save(topics);

	const futbolTopic = await topicsRepository.findOneBy({
		topic_name: "Fútbol"
	})
	const daysOfTheWeekTopic = await topicsRepository.findOneBy({
		topic_name: "Días de la semana"
	})

	// Insert crosswords
	const crosswords = [
		{ title: "Weekdays", language: languages[1], difficulty: 1, topics: [daysOfTheWeekTopic] },
		{ title: "Football Terms", language: languages[1], difficulty: 2, topics: [futbolTopic] },
	];
	await crosswordsRepository.save(crosswords);
	const weekdays = await crosswordsRepository.findOneBy({ title: "Weekdays" });
	const football = await crosswordsRepository.findOneBy({ title: "Football Terms" });

	// Insert crossword words
	const crosswordWords = [
		{ crossword: weekdays, words: wordRepo[0], clue: "Monday" },
		{ crossword: weekdays, words: wordRepo[1], clue: "Tuesday" },
		{ crossword: weekdays, words: wordRepo[2], clue: "Wednesday" },
		{ crossword: weekdays, words: wordRepo[3], clue: "Thursday" },
		{ crossword: weekdays, words: wordRepo[4], clue: "Friday" },
		{ crossword: weekdays, words: wordRepo[5], clue: "Saturday" },
		{ crossword: weekdays, words: wordRepo[6], clue: "Sunday" },
		{ crossword: football, words: wordRepo[7], clue: "Football" },
		{ crossword: football, words: wordRepo[8], clue: "Goalkeeper" },
		{ crossword: football, words: wordRepo[9], clue: "Defender" },
		{ crossword: football, words: wordRepo[10], clue: "Midfielder" },
		{ crossword: football, words: wordRepo[11], clue: "Forward/Striker" },
		{ crossword: football, words: wordRepo[12], clue: "Stadium" },
	];
	await crosswordWordsRepository.save(crosswordWords);

	console.log("Seeding completed!");

	await AppDataSource.destroy();
}
