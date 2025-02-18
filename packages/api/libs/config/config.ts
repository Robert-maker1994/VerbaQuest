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
  
      let port;
      if (process.env.PG_PORT) {
        const parsedPort = Number.parseInt(process.env.PG_PORT);

        if (isNaN(parsedPort)) {
          throw new ConfigError();
        }
        port = parsedPort;
      } else {
        port = 5433; 
      }
  
      if (!user || !password || !host || !database) {
        throw new ConfigError();
      }
  
      return {
        user: user,
        password: password,
        host: host,
        port: port,
        database: database,
      };
    } catch (error) {
      throw new ConfigError();     
    }
  }
  