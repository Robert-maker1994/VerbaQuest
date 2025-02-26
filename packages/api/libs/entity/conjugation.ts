// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Tenses } from "./tense";
// import { Verbs } from "./verb";

// @Entity()
// export class Conjugations {
// 	@PrimaryGeneratedColumn()
// 	conjugation_id: number;

// 	@Column({ type: "int", nullable: false })
// 	verb_id: number;

// 	@Column({ type: "int", nullable: false })
// 	tense_id: number;

// 	@Column({ type: "varchar", length: 50, nullable: true })
// 	grammatical_person: string;

// 	@Column({ type: "varchar", length: 255, nullable: false })
// 	conjugated_form: string;

// 	@Column({ type: "boolean", default: false })
// 	reflexive: boolean;

// 	@Column({ type: "int", nullable: false })
// 	language_id: string;

// 	@ManyToOne(
// 		() => Tenses,
// 		(tense) => tense.conjugations,
// 		{ onDelete: "CASCADE" },
// 	)
// 	tense: Tenses;
// }
