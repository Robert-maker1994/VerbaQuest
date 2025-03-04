import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { UserCrossword } from "./userCrosswords";

@Entity()
export class User {
	@PrimaryGeneratedColumn({ comment: "The unique identifier for each user." })
	user_id: number;

	@Column({
		type: "varchar",
		length: 255,
		unique: true,
		nullable: true,
		comment: "The unique username of the user.",
	})
	username: string;

	@Column({
		type: "varchar",
		length: 255,
		nullable: true,
		comment: "The hashed password of the user (can be null).",
	})
	password_hash: string;

	@Column({
		type: "varchar",
		length: 255,
		unique: true,
		comment: "The email address of the user",
	})
	email: string;

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		comment: "The timestamp of when the user was created",
	})
	created_at: Date;

	@Column({
		type: "varchar",
		length: 255,
		unique: true,
		nullable: true,
		comment: "The unique Google ID of the user",
	})
	google_id: string;

	@OneToMany(
		() => UserCrossword,
		(userCrossword) => userCrossword.user,
	)
	userCrosswords: UserCrossword[];
}
