import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Word } from './word';
import { Crossword } from './crossword';
import { Topic } from './topic';
import { Verb } from './verb';
import { Tense } from './tense';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  language_id: number;

  @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
  language_code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  language_name: string;

  @OneToMany(() => Word, word => word.language)
  words: Word[];

  @OneToMany(() => Crossword, crossword => crossword.language)
  crosswords: Crossword[];

  @OneToMany(() => Topic, topic => topic.language)
  topics: Topic[];

  @OneToMany(() => Verb, verb => verb.language)
  verbs: Verb[];

  @OneToMany(() => Tense, tense => tense.language)
  tenses: Tense[];
}