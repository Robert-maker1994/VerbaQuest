import { Client, Pool } from "pg";
import { seed } from "./seed";

require("dotenv").config();

export async function createDatabase() {
	const dbName = process.env.DB_NAME;

	const client = await new Client({
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		port: Number.parseInt(process.env.DB_PORT),
		database: "postgres", // Connect to the 'postgres' database to create others
	});

	try {
		await client.connect();
		// Check if the database already exists
		const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
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
		const dbCreated = await createDatabase();
	console.log({dbCreated})
        if (!dbCreated) {

            await seed().catch((error) => {
                console.error("Error seeding data:", error);
            });
        }
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
