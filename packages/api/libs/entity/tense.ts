import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Conjugations } from "./conjugation";
import { Languages } from "./language";

@Entity()
export class Tenses {
	@PrimaryGeneratedColumn()
	tense_id: number;

	@Column({ type: "varchar", length: 255, nullable: false })
	tense_name: string;

	@Column({ type: "int", nullable: false })
	language_id: string;

	@ManyToOne(
		() => Languages,
		(language) => language.tenses,
		{ onDelete: "CASCADE" },
	)
	language: Languages;

	@OneToMany(
		() => Conjugations,
		(conjugation) => conjugation.tense,
	)
	conjugations: Conjugations[];
}
