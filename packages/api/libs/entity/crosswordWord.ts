import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { Crossword } from "./crossword";
import { Words } from "./word";

@Entity()
@Unique(["crossword", "words"])
export class CrosswordWord {
	@PrimaryGeneratedColumn()
	crossword_word_id: number;

	@ManyToOne(
		() => Crossword,
		(crossword) => crossword.crosswordWords,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "crossword_id" })
	@Index("idx_crossword_words_crossword_id")
	crossword: Crossword;

	@ManyToOne(
		() => Words,
		(word) => word.crosswordWords,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "word_id" })
	@Index("idx_crossword_words_word_id")
	words: Words;

	@Column({ type: "text" })
	clue: string;
}
