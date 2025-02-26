import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Crossword } from "./crossword";
import { Topic } from "./topic";
import { Words } from "./word";

export enum LanguageCode {
	English = "EN",
	FRENCH = "FR",
	SPANISH = "ES",
}

export enum LanguageName {
	English = "english",
	FRENCH = "france",
	SPANISH = "spanish",
}

@Entity()
export class Languages {
	@PrimaryGeneratedColumn()
	language_id: number;

	@Column({ type: "enum", enum: LanguageCode, nullable: false })
	language_code: string;

	@Column({ type: "enum", enum: LanguageName, nullable: false })
	language_name: string;

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
