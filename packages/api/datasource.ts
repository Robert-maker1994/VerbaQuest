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
import { CreateDatabase1741102530726 } from "./migrations/1741102530726-createdatabase";
import { DefaultUser1741102694977 } from "./migrations/1741102694977-defaultUser";
import { LanguagesTs1741102694988 } from "./migrations/1741102694988-languages";
import { A2SpanishCrosswords1741103308928 } from "./migrations/1741103308928-A2Spanish";


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
	migrations: [CreateDatabase1741102530726, DefaultUser1741102694977, LanguagesTs1741102694988, A2SpanishCrosswords1741103308928],
	migrationsTableName: "verba_migrations",
});
