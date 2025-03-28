import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { Crossword } from "../crossword";
import { User } from "./users";

@Entity()
@Unique(["user_id", "crossword_id"])
export class UserCrossword {
	@PrimaryGeneratedColumn({
		comment: "The unique identifier for this UserCrossword record.",
	})
	user_crossword_id: number;

	@Column({
		type: "int",
		nullable: false,
		comment:
			"Foreign key to the Users table, representing the user who completed the crossword.",
	})
	user_id: number;

	@Column({
		type: "int",
		nullable: false,
		comment:
			"Foreign key to the Crossword table, representing the completed crossword.",
	})
	crossword_id: number;

	@Column({
		type: "text",
		nullable: true,
		comment: "The saved state of the crossword grid for the user",
	})
	grid_state: string;

	@Column({
		type: "int",
		nullable: true,
		comment: "Completion timer in seconds",
	})
	completion_timer: number;

	@Column({
		type: "boolean",
		default: false,
		comment: "Indicates if the user has completed this crossword.",
	})
	completed: boolean;

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		comment: "The last time this crossword was attempted by the user.",
	})
	last_attempted: Date;

	@Column({
		type: "boolean",
		default: false,
		comment: "Indicates if the user has marked this crossword as a favorite.",
	})
	is_favorite: boolean;

	@Column({
		type: "boolean",
		default: false,
		comment:
			"Indicates if the user has marked this crossword as a hidden or not.",
	})
	is_hidden: boolean;

	@ManyToOne(
		() => User,
		(user) => user.userCrosswords,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "user_id" })
	user: User;

	@ManyToOne(
		() => Crossword,
		(crossword) => crossword.userCrosswords,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "crossword_id" })
	crossword: Crossword;
}
