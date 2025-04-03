import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CrosswordWord } from "./crosswordWordEntity";
import { Languages } from "./languageEntity";
import { UserWordProgress } from "./user/UserWordProgressEntity";

@Entity()
export class Word {
  @PrimaryGeneratedColumn({ comment: "The unique identifier for this word." })
  word_id: number;

  @ManyToOne(
    () => Languages,
    (language) => language.words,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "language_id" })
  @Index("idx_words_language_id")
  language: Languages;

  @Column({
    unique: false,
    type: "citext",
    comment: "The text of the word.",
    transformer: {
      to: (value: string) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
      from: (value: string) => value,
    },
  })
  word_text: string;

  @Column({
    type: "citext",
    comment: "The definition of the word.",
    transformer: {
      to: (value: string) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
      from: (value: string) => value,
    },
  })
  definition: string;

  @Column({
    default: false,
    type: "boolean",
    comment: "Whether this word is valid for Wordle.",
  })
  wordle_valid: boolean;

  @OneToMany(
    () => CrosswordWord,
    (crosswordWord) => crosswordWord.words,
  )
  crosswordWords: CrosswordWord[];

  @OneToMany(
    () => UserWordProgress,
    (userWordProgress) => userWordProgress.word,
    { onDelete: "CASCADE" },
  )
  userWordProgress: UserWordProgress[];

  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
    comment: "The part of speech (e.g., noun, verb, adjective).",
  })
  partOfSpeech: string;
}
