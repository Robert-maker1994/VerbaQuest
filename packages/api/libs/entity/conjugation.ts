import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { Form } from "./form";
import { Tense } from "./tenses";
import { Verb } from "./verb";
import { Sentence } from "./sentence";

@Entity()
export class Conjugation {
    @PrimaryGeneratedColumn({
        comment: "The unique identifier for this conjugation.",
    })
    id: number;

    @ManyToOne(() => Verb, { onDelete: "CASCADE" })
    @JoinColumn({ name: "verb_id" })
    verb: Verb;

    @ManyToOne(() => Tense, { onDelete: "CASCADE" })
    @JoinColumn({ name: "tense_id" })
    tense: Tense;

    @ManyToOne(() => Form, { onDelete: "CASCADE" })
    @JoinColumn({ name: "form_id" })

    form: Form;

    @Column({
        type: "varchar",
        length: 255,
        comment: "The conjugated form of the verb.",
    })
    conjugation: string;

    @OneToMany(() => Sentence, (sentence) => sentence.conjugation)
    sentences: Sentence[];
}
