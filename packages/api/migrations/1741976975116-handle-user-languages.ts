import type { MigrationInterface, QueryRunner } from "typeorm";

export class HandleUserLanguages1741976975116 implements MigrationInterface {
    name = 'HandleUserLanguages1741976975116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_preferred_learning_language_enum" AS ENUM('EN', 'ES', 'FR')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "preferred_learning_language" "public"."user_preferred_learning_language_enum" NOT NULL DEFAULT 'ES'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."preferred_learning_language" IS 'The users preferred learning language'`);
        await queryRunner.query(`CREATE TYPE "public"."user_app_language_enum" AS ENUM('EN', 'ES', 'FR')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "app_language" "public"."user_app_language_enum" NOT NULL DEFAULT 'EN'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."app_language" IS 'The users APP language'`);
        await queryRunner.query(`CREATE TYPE "public"."user_preferred_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "preferred_difficulty" "public"."user_preferred_difficulty_enum" NOT NULL DEFAULT 'easy'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."preferred_difficulty" IS 'The users preferred difficulty for the crosswords'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."preferred_difficulty" IS 'The users preferred difficulty for the crosswords'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "preferred_difficulty"`);
        await queryRunner.query(`DROP TYPE "public"."user_preferred_difficulty_enum"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."app_language" IS 'The users APP language'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "app_language"`);
        await queryRunner.query(`DROP TYPE "public"."user_app_language_enum"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."preferred_learning_language" IS 'The users preferred learning language'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "preferred_learning_language"`);
        await queryRunner.query(`DROP TYPE "public"."user_preferred_learning_language_enum"`);
    }

}
