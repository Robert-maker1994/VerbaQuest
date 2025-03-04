import { Client } from "pg";
import 'dotenv/config'
export async function createDatabase() {
	const dbName = process.env.DB_NAME;

	const client = await new Client({
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		port: Number.parseInt(process.env.PG_PORT),
		database: "postgres",
	});

	try {
		await client.connect();

		const res = await client.query(
			`SELECT 1 FROM pg_database WHERE datname='${dbName}'`,
		);
		if (res.rows.length > 0) {
			console.log(`Database "${dbName}" already exists.`);
			return false;
		}
		await client.query(`CREATE DATABASE ${dbName}`);
		console.log(`Database "${dbName}" created successfully.`);
		return true;
	} catch (err) {
		console.error("Error creating database:", err);
		return false;
	} finally {
		client.end();
		console.log("postgres database closed");
	}
}

async function create() {
	try {
		await createDatabase();
		console.log("Create verba database")
		return true;
	} catch (error) {
		console.error("Failed to create database");
		return false;
	}
}

async function main() {
	await create();
}

main();
