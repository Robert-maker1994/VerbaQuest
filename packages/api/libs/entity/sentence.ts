import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Conjugation } from "./conjugation";

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
}