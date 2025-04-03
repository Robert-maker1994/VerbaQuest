import { LanguageCode, LanguageName } from "@verbaquest/types";
import type { MigrationInterface, QueryRunner } from "typeorm";
import config from "../libs/config";
import { Languages, User } from "../libs/entity";

export class Initial1742069418116 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE EXTENSION IF NOT EXISTS unaccent");
    await queryRunner.query("CREATE EXTENSION IF NOT EXISTS citext");
    await queryRunner.manager.getRepository(User).save([
      {
        username: "verba",
        password_hash: "test1234",
        email: "verba@gmail.com",
      },
    ]);
    if (config.authDefaultEmail) {
      await queryRunner.manager.getRepository(User).save([
        {
          username: config.authDefaultUsername,
          password_hash: config.authDefaultPassword,
          email: config.authDefaultEmail,
        },
      ]);
    }
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
    console.info("Languages made!");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository(User).delete({
      username: "verba",
    });
  }
}
