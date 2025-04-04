import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Form } from "../formEntity";
import { Sentence } from "../sentenceEntity";
import { Tense } from "../tenseEntity";
import { Verb } from "../verbs/verbEntity";
import { ConjugationTranslation } from "./conjugationTranslationEntity";

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

  @Column({
    type: "boolean",
    default: false,
    comment: "If the conjugation is irregular or not.",
  })
  is_irregular: boolean;

  @OneToMany(
    () => Sentence,
    (sentence) => sentence.conjugation,
  )
  sentences: Sentence[];

  @OneToMany(
    () => ConjugationTranslation,
    (translation) => translation.conjugation,
  )
  translations: ConjugationTranslation[];
}
