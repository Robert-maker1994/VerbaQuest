import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Crossword } from "./crossword";
import { Topic } from "./topic";
import { Words } from "./word";

export enum LanguageCode {
	English = "EN",
	SPANISH = "ES",
	FRENCH = "FR",
}

export enum LanguageName {
	English = "english",
	SPANISH = "spanish",
	FRENCH = "french",
}

@Entity()
export class Languages {
	@PrimaryGeneratedColumn({
		comment: "The unique identifier for this language.",
	})
	language_id: number;

	@Column({
		type: "enum",
		enum: LanguageCode,
		comment: "The short code for the language (e.g., 'EN', 'ES', 'FR').",
	})
	language_code: LanguageCode;

	@Column({
		type: "enum",
		enum: LanguageName,
		comment:
			"The full name of the language (e.g., 'english', 'spanish', 'french').",
	})
	language_name: LanguageName;

	@OneToMany(
		() => Words,
		(word) => word.language,
	)
	words: Words[];

	@OneToMany(
		() => Crossword,
		(crossword) => crossword.language,
	)
	crosswords: Crossword[];

	@OneToMany(
		() => Topic,
		(topic) => topic.language,
	)
	topics: Topic[];
}
