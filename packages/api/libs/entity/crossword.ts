import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Language } from './language';
import { CrosswordWord } from './crosswordWord';
import { CrosswordTopic } from './crosswordTopic';

@Entity()
export class Crossword {
  @PrimaryGeneratedColumn()
  crossword_id: number;

  @Column({ type: 'int', nullable: false })
  language_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  difficulty: string;

  @ManyToOne(() => Language, language => language, { onDelete: 'CASCADE' })
  language: Language;

  @OneToMany(() => CrosswordWord, crosswordWord => crosswordWord.crossword)
  crosswordWords: CrosswordWord[];

  @OneToMany(() => CrosswordTopic, crosswordTopic => crosswordTopic.crossword)
  crosswordTopics: CrosswordTopic[];
}