import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Language } from './language';
import { Conjugation } from './conjugation';

@Entity()
export class Tense {
  @PrimaryGeneratedColumn()
  tense_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  tense_name: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  language_code: string;

  @ManyToOne(() => Language, language => language.tenses, { onDelete: 'CASCADE' })
  language: Language;

  @OneToMany(() => Conjugation, conjugation => conjugation.tense)
  conjugations: Conjugation[];
}