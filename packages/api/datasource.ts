import { DataSource } from "typeorm";
import config from "./libs/config";
import {
	Crossword,
	CrosswordWord,
	Languages,
	Topic,
	User,
	UserCrossword,
	UserWordProgress,
	Word,
} from "./libs/entity";
import { UpdateDatabase1742069418100 } from "./migrations/1742069418100-update-database";
import { Initial1742069418116 } from "./migrations/1742069418116-inital";
import { Spanish1742069452145 } from "./migrations/1742069452145-spanish";

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
		Languages,
		Topic,
		User,
		UserCrossword,
		Word,
		UserWordProgress,
	],
	subscribers: [],
	migrations: [
		UpdateDatabase1742069418100,
		Initial1742069418116,
		Spanish1742069452145,
	],
	migrationsTableName: "verba_migrations",
});
