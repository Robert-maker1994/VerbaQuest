require("dotenv").config();

class ConfigError extends Error {
	constructor() {
		super("Config Error please check your environment variables");
	}
}

export function loadDatabaseConfig() {
	try {
		const user = process.env.DB_USER;
		const password = process.env.DB_PASSWORD;
		const host = process.env.DB_HOST;
		const database = process.env.DB_NAME;
		const apiKey = process.env.AUTH_API_KEY;
		const projectId = process.env.AUTH_PROJECT_ID;
		const clientEmail = process.env.AUTH_EMAIL_CLIENT;
		const privateKey = process.env.AUTH_PROJECT_KEY

		let port = 5433;

		if (process.env.PG_PORT) {
			const parsedPort = Number.parseInt(process.env.PG_PORT);

			if (Number.isNaN(parsedPort)) {
				throw new ConfigError();
			}
			port = parsedPort;
		}
		if (!user || !password || !host || !database) {
			throw new ConfigError();
		}

		if (!apiKey || !projectId || !clientEmail) {
			throw new ConfigError();
		}

		return {
			user: user,
			password: password,
			host: host,
			port: port,
			database: database,
			apiKey: apiKey,
			projectId,
			privateKey,
			clientEmail
		};
	} catch (error) {
		throw new ConfigError();
	}
}
