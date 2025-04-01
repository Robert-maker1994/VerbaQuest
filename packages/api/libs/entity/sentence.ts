import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Index } from "typeorm";
import { Conjugation } from "./conjugation";
import { Languages } from "./language";

@Entity()
export class Sentence {
    @PrimaryGeneratedColumn({ comment: "The unique identifier for this sentence." })
    id: number;

    @ManyToOne(() => Conjugation, { onDelete: "CASCADE" })
    @JoinColumn({ name: "conjugation_id" })
    conjugation: Conjugation;

    @Column({ type: "text", comment: "The example sentence." })
    sentence: string;

    @Column({ type: "text", nullable: true, comment: "The translation of the sentence." })
    translation: string | null;

    @ManyToOne(() => Languages, { onDelete: "CASCADE" })
    @JoinColumn({ name: "language_id" })
    @Index("idx_sentence_language_id")
    language: Languages;
}