import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Crossword } from "./crossword";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	user_id: number;

	@Column({ length: 255, unique: true, nullable: true })
	username: string;

	@Column({ length: 255, nullable: true })
	password_hash: string;

	@Column({ length: 255, unique: true })
	email: string;

	@Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	@Column({ length: 255, unique: true, nullable: true })
	google_id: string;

	@OneToMany(
		() => UserCrossword,
		(userCrossword) => userCrossword.user,
	)
	userCrosswords: UserCrossword[];
}

@Entity()
export class UserCrossword {
	@PrimaryGeneratedColumn()
	user_crossword_id: number;

	@ManyToOne(
		() => User,
		(user) => user.userCrosswords,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "user_id" })
	@Index("idx_user_crossword_progress_user_id")
	user: User;

	@ManyToOne(
		() => Crossword,
		(crossword) => crossword.userCrosswords,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "crossword_id" })
	@Index("idx_user_crossword_progress_crossword_id")
	crossword: Crossword;

	@Column({ type: "text", nullable: true })
	grid_state: string;

	@Column({ default: false })
	completed: boolean;

	@Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	last_attempted: Date;
}
