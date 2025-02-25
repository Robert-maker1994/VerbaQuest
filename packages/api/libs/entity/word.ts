import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import type { CrosswordWords } from "./crosswordWord";
import { Languages } from "./language";

@Entity()
export class Words {
	@PrimaryGeneratedColumn()
	word_id: number;

	@Column({ type: "int", nullable: false })
	language_id: number;

	@Column({ type: "varchar", length: 255, nullable: false })
	word_text: string;

	@Column({ type: "text", nullable: true })
	definition: string;

	@ManyToOne(
		() => Languages,
		(language) => language,
		{ onDelete: "CASCADE" },
	)
	language: Languages;

	@OneToMany(
		() => Words,
		(word) => word.crosswordWord,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({
		name: "word_id",
	})
	crosswordWord: CrosswordWords[];
}
