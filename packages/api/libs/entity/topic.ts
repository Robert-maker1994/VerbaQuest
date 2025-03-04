import {
	Column,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Crossword } from "./crossword";
import { Languages } from "./language";

@Entity()
export class Topic {
	@PrimaryGeneratedColumn()
	topic_id: number;

	@Column({ type: "citext", unique: true })
	topic_name: string;

	@ManyToOne(
		() => Languages,
		(language) => language.topics,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "language_id" })
	language: Languages;

	@ManyToMany(
		() => Crossword,
		(crossword) => crossword.topics,
	)
	crosswords: Crossword[];
}
