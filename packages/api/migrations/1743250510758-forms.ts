import { LanguageCode } from "@verbaquest/types";
import type { MigrationInterface, QueryRunner } from "typeorm";
import { Form, Languages } from "../libs/entity";

export class Forms1743250510758 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      const languageRepository = queryRunner.manager.getRepository(Languages);
      const formRepository = queryRunner.manager.getRepository(Form);

      const english = await languageRepository.findOneBy({ language_code: LanguageCode.ENGLISH });
      const spanish = await languageRepository.findOneBy({ language_code: LanguageCode.SPANISH });

      if (english && spanish) {
        await formRepository.insert([
          { language: english, form: "I" },
          { language: english, form: "you" },
          { language: english, form: "he/she/it" },
          { language: english, form: "we" },
          { language: english, form: "you (plural)" },
          { language: english, form: "they" },
        ]);

        await formRepository.insert([
          { language: spanish, form: "yo" },
          { language: spanish, form: "tú" },
          { language: spanish, form: "él/ella/usted" },
          { language: spanish, form: "nosotros/nosotras" },
          { language: spanish, form: "vosotros/vosotras" },
          { language: spanish, form: "ellos/ellas/ustedes" },
        ]);
      }
    } catch (error) {
      console.error("Error inserting form data:", error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM form");
  }
}
