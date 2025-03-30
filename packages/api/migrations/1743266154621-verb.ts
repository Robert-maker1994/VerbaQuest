import type { MigrationInterface, QueryRunner } from "typeorm";
import { Verb, Word } from "../libs/entity";

export class Verb1743266154621 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
   

        const verbs = await queryRunner.manager.find(Word, {
            relations: ["language"],
            where: {
                partOfSpeech: "verb"
            }
        });

        const verbRepository = queryRunner.manager.getRepository(Verb);
        try {
            await verbRepository.insert(
                verbs.map((verb) => ({
                    word: verb,
                    language: verb.language
                }))
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
