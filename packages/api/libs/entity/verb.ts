import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Languages } from './language';
import { Conjugations } from './conjugation';

@Entity()
export class Verbs {
  @PrimaryGeneratedColumn()
  verb_id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  infinitive: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  english_translation: string;

  @Column({ type: 'int', length: 10, nullable: false })
  language_id: string;

  @ManyToOne(() => Languages, language => language, { onDelete: 'CASCADE' })
  language: Languages;

  @OneToMany(() => Conjugations, conjugation => conjugation)
  conjugations: Conjugations[];
}