require("dotenv").config();

export function loadDatabaseConfig() {
    try {
      const user = process.env.DB_USER;
      const password = process.env.DB_PASSWORD;
      const host = process.env.DB_HOST;
      const database = process.env.DB_NAME;
  
      // Port parsing with default and error handling
      let port;
      if (process.env.PG_PORT) {

        const parsedPort = Number.parseInt(process.env.PG_PORT);

        if (isNaN(parsedPort)) {
          throw new Error("Invalid PG_PORT environment variable. Must be a number.");
        }
        port = parsedPort;
      } else {
        port = 5433; 
      }
  
      // Check for missing required variables
      if (!user || !password || !host || !database) {
        throw new Error("Missing required database environment variables (DB_USER, DB_PASSWORD, DB_HOST, DB_NAME).");
      }
  
      return {
        user: user,
        password: password,
        host: host,
        port: port,
        database: database,
      };
    } catch (error) {
      console.error("Error loading database configuration:", error.message);
      process.exit(1);
    }
  }
  