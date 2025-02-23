import {
	Column,
	Entity,
	Index,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Crosswords } from "./crossword";
import { Words } from "./word";

@Entity()
@Index(["crossword_id", "word_id"], { unique: true })
export class CrosswordWords {
	@PrimaryGeneratedColumn()
	crossword_word_id: number;

	@Column({ type: "int", nullable: false })
	crossword_id: number;

	@Column({ type: "int", nullable: false })
	word_id: number;

	@Column({ type: "text", nullable: false })
	clue: string;

	@ManyToOne(
		() => Crosswords,
		(crossword) => crossword.crossword_id,
		{ onDelete: "CASCADE" },
	)
	crossword: Crosswords;

	@ManyToOne(
		() => Words,
		(word) => word.word_id,
		{ onDelete: "CASCADE" },
	)
	word: Words;
}
