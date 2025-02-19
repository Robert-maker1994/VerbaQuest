import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Crossword } from './crossword';
import { Topic } from './topic';

@Entity()
@Index(['crossword_id', 'topic_id'], { unique: true })
export class CrosswordTopic {
  @PrimaryGeneratedColumn()
  crossword_topic_id: number;

  @Column({ type: 'int', nullable: false })
  crossword_id: number;

  @Column({ type: 'int', nullable: false })
  topic_id: number;

  @ManyToOne(() => Crossword, crossword => crossword.crosswordTopics, { onDelete: 'CASCADE' })
  crossword: Crossword;

  @ManyToOne(() => Topic, topic => topic.crosswordTopics, { onDelete: 'CASCADE' })
  topic: Topic;
}