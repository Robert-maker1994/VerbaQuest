import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Languages } from "../languageEntity";
import { User } from "../user/usersEntity";
import { Verb } from "./verbEntity";

@Entity()
export class VerbGroup {
  @PrimaryGeneratedColumn({ comment: "The unique identifier for this Verb Group." })
  group_id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  @Index("idx_verb_group_user_id")
  user: User;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    comment: "The name of the verb group.",
  })
  group_name: string;

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    comment: "The date and time the verb group was created.",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    comment: "The date and time the verb group was last updated.",
  })
  updated_at: Date;

  @OneToMany(
    () => UserVerbGroup,
    (userVerbGroup) => userVerbGroup.group,
  )
  userVerbGroups: UserVerbGroup[];
}

@Entity()
export class UserVerbGroup {
  @PrimaryGeneratedColumn({ comment: "The unique identifier for this User Verb Group." })
  user_verb_group_id: number;

  @ManyToOne(() => Languages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "language_id" })
  @Index("idx_user_verb_group_language_id")
  language: Languages;

  @ManyToOne(() => Verb, { onDelete: "CASCADE" })
  @JoinColumn({ name: "verb_id" })
  @Index("idx_user_verb_id")
  verb: Verb;

  @ManyToOne(
    () => VerbGroup,
    (verbGroup) => verbGroup.userVerbGroups,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "group_id" })
  @Index("idx_user_verb_group_id")
  group: VerbGroup;

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    comment: "The date and time the user verb group was created.",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    comment: "The date and time the user verb group was last updated.",
  })
  updated_at: Date;
}
