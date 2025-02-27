import { AppDataSource } from "../../datasource";
import { type LanguageCode, type LanguageName, Languages } from "../entity";
import { LanguageError } from "../errors";

type LanguageParams = {
    language_name?: LanguageName,
    language_code?: LanguageCode
}

export async function getLanguage(params: LanguageParams) {
    const client = AppDataSource;

    const languageEntity = await client.getRepository(Languages).findOneBy({ ...params });

    if (!languageEntity) {
        throw new LanguageError("Unknown language, please provide a different language", 200);
    }

    return languageEntity;
}