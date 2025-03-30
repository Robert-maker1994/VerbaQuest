import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Languages, Word } from ".";

@Entity()
export class Verb {
    @PrimaryGeneratedColumn({ comment: "The unique identifier for this verb." })
    verb_id: number;

    @ManyToOne(() => Word, { onDelete: "CASCADE" })
    @JoinColumn({ name: "word_id" })
    @Index("idx_verbs_word_id")
    word: Word;

    @ManyToOne(() => Languages, { onDelete: "CASCADE" })
    @JoinColumn({ name: "language_id" })
    @Index("idx_verbs_language_id")
    language: Languages;

    @Column({ type: "boolean", default: false, nullable: false, comment: "Weather the verb is irregular or not." })
    irregular: boolean;
}