import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn
  
} from "typeorm";
import { User } from "./users"; // Path to your User entity
import { Words } from "../word";   // Path to your Words entity

@Entity()
export class UserWordProgress {
  @PrimaryGeneratedColumn()
  user_word_progress_id: number;



  @ManyToOne(() => User, (user) => user.userWordProgress, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Words, (word) => word.userWordProgress, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "word_id" })
  word: Words;

  @Column({ type: "boolean", default: false })
  is_favorite: boolean;

  @Column({ type: "boolean", default: false })
  is_wordle_completed: boolean;
}
