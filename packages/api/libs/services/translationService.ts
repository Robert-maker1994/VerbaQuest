import * as fs from "node:fs";
import * as path from "node:path";
import type { LanguageCode } from "@verbaquest/shared";

const translationService = {
	getTranslations: async (appLanguage: LanguageCode) => {
		const translationsFilePath = path.join(
			__dirname,
			"..",
			"..",
			"utils",
			"languages",
			"translations.json",
		);

		try {
			const data = await fs.promises.readFile(translationsFilePath, "utf-8");
			const allTranslations = JSON.parse(data);

			const filteredTranslations: Record<string, string> = {};
			for (const key in allTranslations) {
				if(allTranslations[key] === "favorite_crossword") {
					console.log("hello")
				}
				if (allTranslations[key][appLanguage]) {
					filteredTranslations[key] = allTranslations[key][appLanguage];
				}
			}
			return filteredTranslations;
		} catch (error) {
			console.error("Error reading translations file:", error);
			throw new Error("Failed to load translations");
		}
	},
};

export default translationService;
