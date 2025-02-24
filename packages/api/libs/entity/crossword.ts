import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { CrosswordTopics } from "./crosswordTopic";
import { CrosswordWords } from "./crosswordWord";
import { Languages } from "./language";

@Entity()
export class Crosswords {
	@PrimaryGeneratedColumn()
	crossword_id: number;

	@Column({ type: "int", nullable: false })
	language_id: number;

	@Column({ type: "varchar", length: 255, nullable: true })
	title: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	date_created: Date;

	@Column({ type: "varchar", length: 50, nullable: true })
	difficulty: string;

	@ManyToOne(
		() => Languages,
		(language) => language,
		{ onDelete: "CASCADE" },
	)
	language: Languages;

	@OneToMany(
		() => CrosswordTopics,
		(crosswordTopic) => crosswordTopic.crossword,
	)
	@JoinColumn({
			name: "crossword_id"
		})
	crosswordTopics: CrosswordTopics;

	@OneToMany(
		() => CrosswordWords,
		(crosswordWords) => crosswordWords.crossword,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({
		name: "crossword_id"
	})
	crosswordWords: CrosswordWords[];
}
