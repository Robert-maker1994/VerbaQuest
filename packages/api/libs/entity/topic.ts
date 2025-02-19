import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Languages } from './language';
import { CrosswordTopics } from './crosswordTopic';

@Entity()
export class Topics {
  @PrimaryGeneratedColumn()
  topic_id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  topic_name: string;

  @Column({ type: 'int', nullable: false })
  language_id: number;

  @ManyToOne(() => Languages, language => language.topics, { onDelete: 'CASCADE' })
  language: Languages;

  @OneToMany(() => CrosswordTopics, crosswordTopic => crosswordTopic.topic)
  crosswordTopics: CrosswordTopics[];
}