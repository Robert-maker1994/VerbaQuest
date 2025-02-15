import { Pool, Client } from 'pg';
import fs from "node:fs/promises"
require("dotenv").config();



export async function createTables() {
    const pool = new Pool({
        user: process.env.DB_USER, // Use environment variables!
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: Number.parseInt(process.env.PG_PORT || "5433"),
        database: process.env.DB_NAME
    });

    const db = await pool.connect();

    try {
        const data = await fs.readFile("./seeder/createTables.sql", 'utf-8');

        await db.query(data);
        console.log("query is complete");
    } catch (error) {
        console.error("Error creating tables", error);
        throw error;
    } finally {
        await db.release(true);
        await pool.end();
        console.log("pool is ended")
    }

}


export async function createDatabase() {
    const dbName = process.env.DB_NAME;

    const client = await new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: Number.parseInt(process.env.DB_PORT || "5433"),
        database: 'postgres', // Connect to the 'postgres' database to create others
    });

    try {
        await client.connect();


        await client.query(`CREATE DATABASE ${dbName}`);
        console.log(`Database "${dbName}" created successfully.`);
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        client.end();
        console.log(`postgres database closed`);

    }
}




async function create() {
    try {
        await createDatabase();
        await createTables(); 

        return true
    } catch (error) {
        console.error("Failed to create database")
        return false;
    }
}

async function main() {
    const database = await create();
    
    if(database) {
        
    }
}
