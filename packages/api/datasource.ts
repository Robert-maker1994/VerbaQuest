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

const { host, user, password, database, pg_port } = loadConfig();

export const AppDataSource = new DataSource({
	type: "postgres",
	host: host,
	port: Number.parseInt(pg_port),
	username: user,
	password: password,
	database: database,
	synchronize: false,
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
	migrations: [],
});
