import { DataSource } from "typeorm";
import { loadDatabaseConfig } from "./libs/config/config";
import { Conjugation, Crossword, CrosswordTopic, Language, Tense, Topic, Word } from "./libs/entity";


const { host, user, password, database, port } = loadDatabaseConfig();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: host,
    port: port,
    username: user,
    password: password,
    database: database,
    synchronize: true,
    logging: true,
    entities: [Conjugation, Crossword, CrosswordTopic, Language, Tense, Topic, Word],
    subscribers: [],
    migrations: [],
})