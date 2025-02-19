import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Languages } from './language';
import { CrosswordWords } from './crosswordWord';
import { CrosswordTopics } from './crosswordTopic';

@Entity()
export class Crosswords {
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

  @ManyToOne(() => Languages, language => language, { onDelete: 'CASCADE' })
  language: Languages;

  @OneToMany(() => CrosswordTopics, crosswordTopic => crosswordTopic.crossword)
  crosswordTopics: CrosswordTopics[];
}