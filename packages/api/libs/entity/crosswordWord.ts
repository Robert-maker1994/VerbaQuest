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
import { Word } from "./word";

@Entity()
@Unique(["crossword", "words"])
export class CrosswordWord {
	@PrimaryGeneratedColumn({
		comment: "The unique identifier for this CrosswordWord record.",
	})
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
		() => Word,
		(word) => word.crosswordWords,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "word_id" })
	@Index("idx_crossword_words_word_id")
	words: Word;

	@Column({
		type: "text",
		comment: "The clue for this word in the associated crossword.",
	})
	clue: string;
}
