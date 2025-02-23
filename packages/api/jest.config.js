/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
	preset: "ts-jest", // Use ts-jest if you're using TypeScript

	clearMocks: true,

	// Indicates whether the coverage information should be collected while executing the tests
	collectCoverage: true,

	// The directory where Jest should output its coverage files
	coverageDirectory: "coverage",

	// An array of regexp pattern strings that are used to skip coverage collection
	coveragePathIgnorePatterns: ["/node_modules/"],

	// A list of reporter names that Jest uses when writing coverage reports
	coverageReporters: ["text", "lcov", "clover", "html"],

	// An array of file extensions your modules use
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

	// The test environment that will be used for testing
	testEnvironment: "node",

	// The glob patterns Jest uses to find test files
	testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],

	// A map from regular expressions to module names that allow stubbing specific imports
	moduleNameMapper: {
		// If you use module aliases, define them here.  Example:
		// "^@/(.*)$": "<rootDir>/src/$1"
	},

	// Add more setup files if needed
	// setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],

	// Test results processor to add custom messages, error stack traces etc.
	// reporters: [
	//   "default",
	//   ["./custom-reporter.js", { /* options */ }]
	// ],

	// Indicates whether to use watchman for file crawling
	// watchman: true,

	// Run tests from only one or more specified projects
	// projects: [
	//   "<rootDir>/packages/*"
	// ],

	// Stop after the first failure
	bail: true,
};
