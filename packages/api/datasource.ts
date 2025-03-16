import { DataSource } from "typeorm";
import config from "./libs/config";
import {
	Crossword,
	CrosswordWord,
	Languages,
	Topic,
	Words,
} from "./libs/entity";
import { UserCrossword } from "./libs/entity/user/userCrosswords";
import { User } from "./libs/entity/user/users";
import { CreateDatabase1742069418114 } from "./migrations/1742069418114-create-database";
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
		Words,
	],
	subscribers: [],
	migrations: [
		CreateDatabase1742069418114,
		Initial1742069418116,
		Spanish1742069452145,
	],
	migrationsTableName: "verba_migrations",
});
