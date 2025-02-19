import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Language } from './language';
import { CrosswordTopic } from './crosswordTopic';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  topic_id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  topic_name: string;

  @Column({ type: 'int', nullable: false })
  language_id: number;

  @ManyToOne(() => Language, language => language.topics, { onDelete: 'CASCADE' })
  language: Language;

  @OneToMany(() => CrosswordTopic, crosswordTopic => crosswordTopic.topic)
  crosswordTopics: CrosswordTopic[];
}