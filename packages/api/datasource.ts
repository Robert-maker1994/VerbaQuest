import { DataSource } from "typeorm";
import { loadDatabaseConfig } from "./libs/config/config";
import { Conjugations, Crosswords, CrosswordTopics, CrosswordWords, Languages, Tenses, Topics, Words } from "./libs/entity";


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
    entities: [Conjugations, Crosswords, CrosswordTopics, CrosswordWords, Languages, Tenses, Topics, Words],
    subscribers: [],
    migrations: [],
})