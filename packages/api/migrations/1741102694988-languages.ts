import type { MigrationInterface, QueryRunner } from "typeorm";
import { LanguageCode, LanguageName, Languages } from "../libs/entity";

export class LanguagesTs1741102694988 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const languageRepository = queryRunner.manager.getRepository(Languages);

		const languages = [
			{
				language_code: LanguageCode.ENGLISH,
				language_name: LanguageName.ENGLISH,
			},
			{
				language_code: LanguageCode.SPANISH,
				language_name: LanguageName.SPANISH,
			},
		];
		await languageRepository.save(languages);
		console.log("Languages made!");
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("DELETE FROM languages");
	}
}
