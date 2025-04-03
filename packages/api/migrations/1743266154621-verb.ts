import fs from "node:fs";
import path from "node:path";
import csv from "csv-parser";
import type { MigrationInterface, QueryRunner } from "typeorm";
import { Verb, Word } from "../libs/entity";
import { Languages } from "../libs/entity";
export class Verb1743266154621 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const csvFilePath = path.join(__dirname, "../../seeder/irregular_verbs.csv");

    const languageRecords = await queryRunner.manager.getRepository(Languages).find();
    if (!languageRecords) {
      throw new Error(`Target language with code ${languageRecords} not found.`);
    }

    // 1. Read and Parse CSV File
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const csvData: any[] = await new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (row) => {
          rows.push(row?.irregular);
        })
        .on("end", () => resolve(rows))
        .on("error", reject);
    });

    const verbs = await queryRunner.manager.find(Word, {
      relations: ["language"],
      where: {
        partOfSpeech: "verb",
      },
    });

    const verbRepository = queryRunner.manager.getRepository(Verb);
    try {
      await verbRepository.insert(
        verbs.map((verb) => ({
          word: verb,
          language: verb.language,
          irregular: csvData.includes(verb.word_text.toLowerCase()),
        })),
      );
    } catch (error) {
      console.error("Error inserting verb data:", error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "idx_verb_language_id";
        `);
    await queryRunner.query(`
            DROP INDEX "idx_verb_word_id";
        `);
    await queryRunner.query(`
            DROP TABLE "verb";
        `);
  }
}
