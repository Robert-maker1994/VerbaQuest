import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Crosswords } from "./crossword";

@Entity()
export class Users {
	@PrimaryGeneratedColumn()
	user_id: number;

	@Column({ type: "varchar", length: 255, unique: true, nullable: true })
	username: string;

	@Column({ type: "varchar", length: 255, nullable: true })
	password_hash: string;

	@Column({ type: "varchar", length: 255, unique: true })
	email: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	@Column({ type: "varchar", length: 255, unique: true, nullable: true })
	google_id: string;

	@OneToMany(
		() => UserCrosswords,
		(userCrossword) => userCrossword.user,
	)
	userCrosswords: UserCrosswords[];
}

@Entity()
export class UserCrosswords {
	@PrimaryGeneratedColumn()
	user_crossword_id: number;

	@Column({ type: "int", nullable: false })
	user_id: number;

	@Column({ type: "int", nullable: false })
	crossword_id: number;

	@Column({ type: "text", nullable: true })
	grid_state: string;

	@Column({ type: "boolean", default: false })
	completed: boolean;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	last_attempted: Date;

	@ManyToOne(
		() => Users,
		(user) => user.userCrosswords,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "user_id" })
	user: Users;

	@ManyToOne(
		() => Crosswords,
		(crossword) => crossword.userCrosswords,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "crossword_id" })
	crossword: Crosswords;
}
