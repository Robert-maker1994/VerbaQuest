import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { CrosswordWord } from "./crosswordWord";
import { Languages } from "./language";

@Entity()
export class Words {
	@PrimaryGeneratedColumn({ comment: "The unique identifier for this word." })
	word_id: number;

	@ManyToOne(
		() => Languages,
		(language) => language.words,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "language_id" })
	@Index("idx_words_language_id")
	/**
	 * Foreign key to the Languages table. Represents the language of this word.
	 */
	language: Languages;

	@Column({
		unique: true,
		type: "citext",
		comment: "The text of the word.",
		transformer: {
			to: (value: string) => {
				return value.charAt(0).toUpperCase() + value.slice(1);
			},
			from: (value: string) => value,
		},
	})
	word_text: string;

	@Column({
		type: "citext",
		unique: true,
		comment: "The definition of the word.",
	})
	definition: string;

	@Column({
		default: false,
		comment: "Whether this word is valid for Wordle.",
	})
	wordle_valid: boolean;

	@OneToMany(
		() => CrosswordWord,
		(crosswordWord) => crosswordWord.words,
	)
	/**
	 * One-to-many relationship with CrosswordWord. One word can appear in multiple crosswords.
	 */
	crosswordWords: CrosswordWord[];
}
