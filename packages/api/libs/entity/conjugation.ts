import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Verb } from './verb';
import { Tense } from './tense';

@Entity()
export class Conjugation {
  @PrimaryGeneratedColumn()
  conjugation_id: number;

  @Column({ type: 'int', nullable: false })
  verb_id: number;

  @Column({ type: 'int', nullable: false })
  tense_id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  grammatical_person: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  conjugated_form: string;

  @Column({ type: 'boolean', default: false })
  reflexive: boolean;

  @Column({ type: 'varchar', length: 10, nullable: false })
  language_code: string;

  @ManyToOne(() => Verb, verb => verb.conjugations, { onDelete: 'CASCADE' })
  verb: Verb;

  @ManyToOne(() => Tense, tense => tense.conjugations, { onDelete: 'CASCADE' })
  tense: Tense;
}