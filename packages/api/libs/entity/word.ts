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
	@PrimaryGeneratedColumn()
	word_id: number;

	@ManyToOne(
		() => Languages,
		(language) => language.words,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "language_id" })
	@Index("idx_words_language_id")
	language: Languages;

	@Column({ unique: true, type: "citext" })
	word_text: string;

	@Column({ type: "citext", unique: true })
	definition: string;

	@Column({ default: false })
	wordle_valid: boolean;

	@OneToMany(
		() => CrosswordWord,
		(crosswordWord) => crosswordWord.words,
	)
	crosswordWords: CrosswordWord[];
}
