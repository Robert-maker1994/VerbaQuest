import "dotenv/config";
class ConfigError extends Error {
	constructor(message) {
		super(`Config Error please check your environment variables ${message}`);
	}
}

export function loadConfig() {
	try {
		const config = {
			password: process.env.DB_PASSWORD,
			user: process.env.DB_USER,
			projectId: process.env.AUTH_PROJECT_ID,
			host: process.env.DB_HOST,
			port: process.env.PORT,
			pg_port: process.env.PG_PORT,
			database: process.env.DB_NAME,
			apiKey: process.env.AUTH_API_KEY,
			clientEmail: process.env.AUTH_EMAIL_CLIENT,
			privateKey: process.env.AUTH_PRIVATE_KEY,
		};

		for (const [key, value] of Object.entries(config)) {
			if (!value) {
				throw new ConfigError(key);
			}
		}

		return {
			...config,
		};
	} catch (error) {
		if (error instanceof ConfigError) {
			throw error;
		}
		throw new ConfigError(error.message);
	}
}
