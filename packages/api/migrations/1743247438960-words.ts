import type { MigrationInterface, QueryRunner } from "typeorm";
import { Languages, Word } from "../libs/entity";
import type { LanguageCode } from "@verbaquest/types";
import path from "node:path";
import fs from "node:fs";
import csv from "csv-parser";

interface CSVRow {
    language_code: LanguageCode;
    word: string;
    definition: string;
    part_of_speech: string;
}

export class Words1743247438960 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const csvFilePath = path.join(__dirname, "../../seeder/words.csv");
    
        const languageRecords = await queryRunner.manager.getRepository(Languages).find();
        if (!languageRecords) {
            throw new Error(
                `Target language with code ${languageRecords} not found.`,
            );
        }
        // Data Structures to Hold Unique Entities
        const wordsMap: Map<string, Word> = new Map();

        // 1. Read and Parse CSV File
        const csvData: CSVRow[] = await new Promise((resolve, reject) => {
            const rows: CSVRow[] = [];
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on("data", (row: CSVRow) => {
                    rows.push(row);
                })
                .on("end", () => resolve(rows))
                .on("error", reject);
        });

        // 2. Process Data from CSV
        for (const row of csvData) {
            const { language_code, word, definition, part_of_speech } = row;
            const language = languageRecords.find((lang) => lang.language_code === language_code);

            if (!language) {
                throw new Error(`Language with code ${language_code} not found.`);
            }
            const wordKey = `${language.language_code}-${word}`;

            if (!wordsMap.has(wordKey)) {
                const wordEntity = new Word();
                wordEntity.word_text = word;
                wordEntity.language = language;
                wordEntity.wordle_valid = word.length === 5;
                wordEntity.definition = definition;
                wordEntity.partOfSpeech = part_of_speech;
                wordsMap.set(wordKey, wordEntity);
            }


            // 3. Insert Data in Batches (Transaction)
            await queryRunner.startTransaction();

            try {
              await queryRunner.manager.save(Array.from(wordsMap.values()));
                await queryRunner.commitTransaction();
            } catch (error) {
                await queryRunner.rollbackTransaction();
                console.error("Error inserting data:", error);
                throw error;
            }

        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("DELETE FROM word");

    }

}
