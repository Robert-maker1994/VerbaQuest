import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Crosswords } from "./crossword";
import { Tenses } from "./tense";
import { Topics } from "./topic";
import { Verbs } from "./verb";
import { Words } from "./word";

@Entity()
export class Languages {
	@PrimaryGeneratedColumn()
	language_id: number;

	@Column({ type: "varchar", length: 10, unique: true, nullable: false })
	language_code: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	language_name: string;

	@OneToMany(
		() => Words,
		(word) => word.language,
	)
	words: Words[];

	@OneToMany(
		() => Crosswords,
		(crossword) => crossword.language,
	)
	crosswords: Crosswords[];

	@OneToMany(
		() => Topics,
		(topic) => topic.language,
	)
	topics: Topics[];

	@OneToMany(
		() => Tenses,
		(tense) => tense.language,
	)
	tenses: Tenses[];
}
