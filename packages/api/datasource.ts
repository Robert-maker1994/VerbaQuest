import { DataSource } from "typeorm";
import config from "./libs/config";
import {
	Conjugation,
	Crossword,
	CrosswordWord,
	Form,
	Languages,
	Sentence,
	Tense,
	Topic,
	User,
	UserCrossword,
	UserWordProgress,
	Verb,
	Word,
} from "./libs/entity";
import { Initial1742069418116 } from "./migrations/1742069418116-inital";
import { UpdateDatabase1742069418100 } from "./migrations/1742069418100-update-database";
import { Verb1743266154621 } from "./migrations/1743266154621-verb";
import { Words1743247438960 } from "./migrations/1743247438960-words";
import { Tense1743248711332 } from "./migrations/1743248711332-tense";
import { Forms1743250510758 } from "./migrations/1743250510758-forms";
import { Conjugations1743278126814 } from "./migrations/1743278126814-conjugations";
import { Spanish1743278126817 } from "./migrations/1743278126817-spanish";
import { Sentences1743320907018 } from "./migrations/1743320907018-sentences";

const { host, user, password, database, pg_port } = config;

export const AppDataSource = new DataSource({
	type: "postgres",
	host: host,
	port: Number.parseInt(pg_port),
	username: user,
	password: password,
	database: database,
	synchronize: false,
	migrationsRun: true,
	logging: true,
	entities: [
		Crossword,
		CrosswordWord,
		Conjugation,
		Form,
		Languages,
		Topic,
		Tense,
		Word,
		Verb,
		Sentence,
		User,
		UserCrossword,
		UserWordProgress,
	],
	subscribers: [],
	migrations: [
		UpdateDatabase1742069418100,
		Initial1742069418116,
		Words1743247438960,
		Tense1743248711332,
		Forms1743250510758,
		Verb1743266154621,
		Conjugations1743278126814,
		Spanish1743278126817,
		Sentences1743320907018
		
	],
	migrationsTableName: "verba_migrations",
});
