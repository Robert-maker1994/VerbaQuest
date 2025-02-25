import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Crosswords } from "./crossword";
import { Topics } from "./topic";

@Entity()
@Index(["crossword_id", "topic_id"], { unique: true })
export class CrosswordTopics {
	@PrimaryGeneratedColumn()
	crossword_topic_id: number;

	@Column({ type: "int", nullable: false })
	crossword_id: number;

	@Column({ type: "int", nullable: false })
	topic_id: number;

	@ManyToOne(
		() => Crosswords,
		(crossword) => crossword.crosswordTopics,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({
		name: "crossword_id",
	})
	crossword: Crosswords;

	@ManyToOne(
		() => Topics,
		(topic) => topic.crosswordTopics,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({
		name: "topic_id",
	})
	topics: Topics;
}
