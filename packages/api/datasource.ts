import { DataSource } from "typeorm";
import { loadConfig } from "./libs/config/config";
import {
	Crossword,
	CrosswordWord,
	Languages,
	Topic,
	Words,
} from "./libs/entity";
import { User, UserCrossword } from "./libs/entity/users";
import { LanguagesTs1741095288212 } from "./migrations/1741095288212-languages";
import { a2 } from "vitest/dist/chunks/reporters.DTtkbAtP";

const { host, user, password, database, pg_port } = loadConfig();

export const AppDataSource = new DataSource({
	type: "postgres",
	host: host,
	port: Number.parseInt(pg_port),
	username: user,
	password: password,
	database: database,
	synchronize: false,
	migrationsRun: true,
	logging: false,
	entities: [
		Crossword,
		CrosswordWord,
		Languages,
		Topic,
		User,
		UserCrossword,
		Words,
	],
	subscribers: [],
	migrations: [LanguagesTs1741095288212, a2],
	migrationsTableName: "verba_migrations",
});
