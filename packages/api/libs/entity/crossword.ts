import {
	Column,
	Entity,
	Index,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { CrosswordWord } from "./crosswordWord";
import { Languages } from "./language";
import { Topic } from "./topic";
import { UserCrossword } from "./users";

@Entity()
export class Crossword {
	@PrimaryGeneratedColumn()
	crossword_id: number;

	@ManyToOne(
		() => Languages,
		(language) => language.crosswords,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "language_id" })
	language: Languages;

	@Column({ type: "citext", unique: true })
	title: string;

	@Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	date_created: Date;

	@Column()
	difficulty: number;

	@Column({ type: "boolean", default: true })
	is_Public: boolean;

	@OneToMany(
		() => CrosswordWord,
		(crosswordWord) => crosswordWord.crossword,
	)
	crosswordWords: CrosswordWord[];

	@OneToMany(
		() => UserCrossword,
		(userCrossword) => userCrossword.crossword,
	)
	userCrosswords: UserCrossword[];

	@ManyToMany(() => Topic)
	@JoinTable({
		name: "crossword_topics",
		joinColumn: { name: "crossword_id", referencedColumnName: "crossword_id" },
		inverseJoinColumn: { name: "topic_id", referencedColumnName: "topic_id" },
	})
	topics: Topic[];
}
