import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Language } from './language';
import { Conjugation } from './conjugation';

@Entity()
export class Verb {
  @PrimaryGeneratedColumn()
  verb_id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  infinitive: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  english_translation: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  language_code: string;

  @ManyToOne(() => Language, language => language.verbs, { onDelete: 'CASCADE' })
  language: Language;

  @OneToMany(() => Conjugation, conjugation => conjugation.verb)
  conjugations: Conjugation[];
}