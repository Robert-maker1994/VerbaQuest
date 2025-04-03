import { Difficulty } from "@verbaquest/types";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CrosswordWord } from "./crosswordWordEntity";
import { Languages } from "./languageEntity";
import { Topic } from "./topicEntity";
import { UserCrossword } from "./user/userCrosswordsEntity";

@Entity()
export class Crossword {
  @PrimaryGeneratedColumn({
    comment: "The unique identifier for this crossword.",
  })
  crossword_id: number;

  @ManyToOne(
    () => Languages,
    (language) => language.crosswords,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "language_id" })
  language: Languages;

  @Column({
    type: "citext",
    unique: true,
    comment: "The title of the crossword puzzle.",
  })
  title: string;

  @Column({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    comment: "The date and time the crossword was created.",
  })
  date_created: Date;

  @Column({
    type: "enum",
    enum: Difficulty,
    comment: "The level of difficulty of the crossword puzzle.",
  })
  difficulty: Difficulty;

  @Column({
    type: "boolean",
    default: true,
    comment: "Indicates whether this crossword is publicly available.",
  })
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
