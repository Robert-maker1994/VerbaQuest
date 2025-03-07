import "dotenv/config";

class ConfigError extends Error {
    constructor(message) {
        super(`Config Error please check your environment variables ${message}`);
    }
}

function loadConfig() {
    try {
        const authConfig = process.env.AUTH_MODE === "LOCAL" ? {
            authDefaultToken: process.env.DEFAULT_TOKEN,
            authDefaultUsername: process.env.DEFAULT_USERNAME,
            authDefaultPassword: process.env.DEFAULT_PASSWORD,
            authDefaultEmail: process.env.DEFAULT_EMAIL
        } : {
            apiKey: process.env.AUTH_API_KEY,
            clientEmail: process.env.AUTH_EMAIL_CLIENT,
            privateKey: process.env.AUTH_PRIVATE_KEY,
            projectId: process.env.AUTH_PROJECT_ID,

        }
        const config = {
            required: {
                password: process.env.DB_PASSWORD,
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                port: process.env.PORT,
                pg_port: process.env.PG_PORT,
                database: process.env.DB_NAME,
                authMode: process.env.AUTH_MODE,
                ...authConfig
            },
           

        };


        for (const [key, value] of Object.entries(config.required)) {
            if (!value) {
                throw new ConfigError(key);
            }
        }

        return {
            ...config.required,
        };
    } catch (error) {
        if (error instanceof ConfigError) {
            throw error;
        }
        throw new ConfigError(error.message);
    }
}

const config = loadConfig();
export default config;