import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Words } from './word';
import { Crosswords } from './crossword';
import { Topics } from './topic';
import { Verbs } from './verb';
import { Tenses } from './tense';

@Entity()
export class Languages {
  @PrimaryGeneratedColumn()
  language_id: number;

  @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
  language_code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  language_name: string;

  @OneToMany(() => Words, word => word.language)
  words: Words[];

  @OneToMany(() => Crosswords, crossword => crossword.language)
  crosswords: Crosswords[];

  @OneToMany(() => Topics, topic => topic.language)
  topics: Topics[];


  @OneToMany(() => Tenses, tense => tense.language)
  tenses: Tenses[];
}