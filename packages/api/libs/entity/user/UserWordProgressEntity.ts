import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Word } from "../wordEntity"; // Path to your Words entity
import { User } from "./usersEntity"; // Path to your User entity

@Entity()
export class UserWordProgress {
  @PrimaryGeneratedColumn()
  user_word_progress_id: number;

  @ManyToOne(
    () => User,
    (user) => user.userWordProgress,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(
    () => Word,
    (word) => word.userWordProgress,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "word_id" })
  word: Word;

  @Column({ type: "boolean", default: false })
  is_favorite: boolean;

  @Column({ type: "boolean", default: false })
  is_wordle_completed: boolean;
}
