import { Pool, PoolClient } from "pg";
import { loadDatabaseConfig } from "../libs/config/config";

const dbConfig = loadDatabaseConfig();

const pool = new Pool({
	user: dbConfig.user, // Use environment variables!
	password: dbConfig.password,
	host: dbConfig.host,
	port: Number.parseInt(process.env.PG_PORT || "5433"),
	database: dbConfig.database,
});

function getConnection() {
	return pool.connect();
}

function closeConnection() {
	return pool.end();
}

export { getConnection, closeConnection };
