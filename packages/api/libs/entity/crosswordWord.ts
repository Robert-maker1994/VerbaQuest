import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Crossword } from './crossword';
import { Word } from './word';

@Entity()
@Index(['crossword_id', 'word_id'], { unique: true })
export class CrosswordWord {
  @PrimaryGeneratedColumn()
  crossword_word_id: number;

  @Column({ type: 'int', nullable: false })
  crossword_id: number;

  @Column({ type: 'int', nullable: false })
  word_id: number;

  @Column({ type: 'text', nullable: false })
  clue: string;

  @ManyToOne(() => Crossword, crossword => crossword.crosswordWords, { onDelete: 'CASCADE' })
  crossword: Crossword;

  @ManyToOne(() => Word, word => word.crosswordWords, { onDelete: 'CASCADE' })
  word: Word;
}