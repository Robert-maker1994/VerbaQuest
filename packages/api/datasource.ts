import { DataSource } from "typeorm";
import config from "./libs/config";
import {
	Crossword,
	CrosswordWord,
	Languages,
	Topic,
	Words,
} from "./libs/entity";
import { UserCrossword } from "./libs/entity/userCrosswords";
import { User } from "./libs/entity/users";
import { CreateDatabase1741102530726 } from "./migrations/1741102530726-createdatabase";
import { DefaultUser1741102694977 } from "./migrations/1741102694977-defaultUser";
import { LanguagesTs1741102694988 } from "./migrations/1741102694988-languages";
import { A2SpanishCrosswords1741103308928 } from "./migrations/1741103308928-A2Spanish";
import { UpdateComments1741174026478 } from "./migrations/1741174026478-update-comments";
import { DefaultUser1741364178006 } from "./migrations/1741364178006-default-user";

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
		CreateDatabase1741102530726,
		DefaultUser1741102694977,
		LanguagesTs1741102694988,
		A2SpanishCrosswords1741103308928,
		UpdateComments1741174026478,
		DefaultUser1741364178006
	],
	migrationsTableName: "verba_migrations",
});
