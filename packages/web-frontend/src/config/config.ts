class ConfigError extends Error {
	constructor(message: string) {
		super(`Config Error: ${message}`);
	}
}

export function loadConfig() {
	const config = {
		apiBaseUrl: import.meta.env.BASE_URL,
	};

	for (const [key, value] of Object.entries(config)) {
		if (!value) {
			throw new ConfigError(`${key} is not set`);
		}
	}

	return {
		...config,
	};
}
