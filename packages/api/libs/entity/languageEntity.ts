import { LanguageCode, LanguageName } from "@verbaquest/types";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Crossword } from "./crosswordEntity";
import { Topic } from "./topicEntity";
import { Word } from "./wordEntity";

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
		() => Word,
		(word) => word.language,
	)
	words: Word[];

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
