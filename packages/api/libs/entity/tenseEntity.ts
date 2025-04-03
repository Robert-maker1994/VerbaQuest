import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Conjugation } from "./conjugationEntity";
import { Languages } from "./languageEntity";

@Entity()
export class Tense {
    @PrimaryGeneratedColumn({ comment: "The unique identifier for this tense." })
    tense_id: number;

    @ManyToOne(() => Languages, { onDelete: "CASCADE" })
    @JoinColumn({ name: "language_id" })
    language: Languages;

    @Column({
        type: "varchar",
        length: 50,
        comment: "The name of the tense (e.g., present, past, future).",
    })
    tense: string;

    @Column({
        type: "text",
        nullable: true,
        comment: "Description or path to Markdown file for the tense.",
    })
    description: string | null;

    @Column({
        type: "varchar",
        length: 50,
        comment: "The mood of the tense (e.g., indicative, subjunctive).",
        nullable: true,
    })
    mood: string | null;

    @OneToMany(() => Conjugation, (conjugation) => conjugation.tense)
    conjugations: Conjugation[];
}