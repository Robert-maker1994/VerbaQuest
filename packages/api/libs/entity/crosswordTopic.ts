// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from "typeorm";
// import { Crossword } from "./crossword";
// import { Topic } from "./topic";

// @Entity()
// @Index("idx_crossword_topics_crossword_id", ["crossword_id"])
// @Index("idx_crossword_topics_topic_id", ["topic_id"])
// @Index(["crossword_id", "topic_id"], { unique: true })
// export class CrosswordTopics {
//   @PrimaryGeneratedColumn()
//   crossword_topic_id: number;

//   @Column({ type: "int", nullable: false })
//   crossword_id: number;

//   @Column({ type: "int", nullable: false })
//   topic_id: number;

//   @ManyToOne(() => Crossword, (crossword) => crossword.crosswordTopics, { onDelete: "CASCADE" })
//   crossword: Crossword;

//   @ManyToOne(() => Topic, (topic) => topic., { onDelete: "CASCADE" })
//   topic: Topic;
// }
