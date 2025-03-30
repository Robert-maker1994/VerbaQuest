import type { LanguageCode, LanguageName } from "@verbaquest/types";
import { AppDataSource } from "../../datasource";
import { Languages } from "../entity";
import { LanguageError } from "../errors";

type LanguageParams = {
	language_name?: LanguageName;
	language_code?: LanguageCode;
};

export async function getLanguage(params: LanguageParams) {
	const client = AppDataSource;

	const languageEntity = await client
		.getRepository(Languages)
		.findOneBy({ ...params });

	if (!languageEntity) {
		throw new LanguageError(
			"Unknown language, please provide a different language",
			200,
		);
	}

	return languageEntity;
}
