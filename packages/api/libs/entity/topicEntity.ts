import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Crossword } from "./crosswordEntity";
import { Languages } from "./languageEntity";

@Entity()
export class Topic {
  @PrimaryGeneratedColumn({ comment: "The unique identifier for this topic." })
  topic_id: number;

  @Column({
    type: "citext",
    unique: true,
    comment: "The name of the topic.",
    transformer: {
      to: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
      from: (value: string) => value,
    },
  })
  @Index("idx_topic_name", ["topic_name"], { unique: true })
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
