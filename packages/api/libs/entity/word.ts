import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Language } from './language';
import { CrosswordWord } from './crosswordWord';

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  word_id: number;

  @Column({ type: 'int', nullable: false })
  language_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  word_text: string;

  @Column({ type: 'text', nullable: true })
  definition: string;

  @ManyToOne(() => Language, language => language.words, { onDelete: 'CASCADE' })
  language: Language;

  @OneToMany(() => CrosswordWord, crosswordWord => crosswordWord.word)
  crosswordWords: CrosswordWord[];
}