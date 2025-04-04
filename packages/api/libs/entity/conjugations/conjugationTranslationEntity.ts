import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Languages } from "../languageEntity";
import { Conjugation } from "./conjugationEntity";

@Entity()
export class ConjugationTranslation {
  @PrimaryGeneratedColumn({ comment: "The unique identifier for this sentence." })
  conjugationTranslationId: number;

  @ManyToOne(() => Conjugation, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id" })
  conjugation: Conjugation;

  @Column({ type: "text", nullable: true, comment: "The translation of the conjugation." })
  translation: string | null;

  @ManyToOne(() => Languages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "language_id" })
  @Index("idx_conjugation_translation_language_id")
  language: Languages;
}
