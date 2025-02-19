import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Languages } from './language';
import { CrosswordWords } from './crosswordWord';

@Entity()
export class Words {
  @PrimaryGeneratedColumn()
  word_id: number;

  @Column({ type: 'int', nullable: false })
  language_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  word_text: string;

  @Column({ type: 'text', nullable: true })
  definition: string;

  @ManyToOne(() => Languages, language => language.words, { onDelete: 'CASCADE' })
  language: Languages;

}