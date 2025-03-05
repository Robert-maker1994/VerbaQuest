import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1741102530726 implements MigrationInterface {
	name = "Migrations1741102530726";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("CREATE EXTENSION IF NOT EXISTS unaccent;");
		await queryRunner.query(
			`CREATE TYPE "public"."languages_language_code_enum" AS ENUM('EN', 'ES', 'FR')`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."languages_language_name_enum" AS ENUM('english', 'spanish', 'french')`,
		);
		await queryRunner.query(
			`CREATE TABLE "languages" ("language_id" SERIAL NOT NULL, "language_code" "public"."languages_language_code_enum" NOT NULL, "language_name" "public"."languages_language_name_enum" NOT NULL, CONSTRAINT "PK_108420613c85f301619cf49234d" PRIMARY KEY ("language_id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "topic" ("topic_id" SERIAL NOT NULL, "topic_name" citext NOT NULL, "language_id" integer, CONSTRAINT "UQ_b07c38f7593a528dd6d5e85e511" UNIQUE ("topic_name"), CONSTRAINT "PK_d91aa173b2e6549130633b15a2d" PRIMARY KEY ("topic_id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "words" ("word_id" SERIAL NOT NULL, "word_text" citext NOT NULL, "definition" citext NOT NULL, "wordle_valid" boolean NOT NULL DEFAULT false, "language_id" integer, CONSTRAINT "UQ_1eee62f27091adcba5cc43c1ee2" UNIQUE ("word_text"), CONSTRAINT "UQ_0499774be070c4084bcd0532f5e" UNIQUE ("definition"), CONSTRAINT "PK_f5938f158c76372fb10397a67ab" PRIMARY KEY ("word_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx_words_language_id" ON "words" ("language_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "crossword_word" ("crossword_word_id" SERIAL NOT NULL, "clue" text NOT NULL, "crossword_id" integer, "word_id" integer, CONSTRAINT "UQ_1c6bac704152540d25a3ec23ab2" UNIQUE ("crossword_id", "word_id"), CONSTRAINT "PK_3a6d4504682127e83fa0cf3ddb8" PRIMARY KEY ("crossword_word_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx_crossword_words_crossword_id" ON "crossword_word" ("crossword_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx_crossword_words_word_id" ON "crossword_word" ("word_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "user" ("user_id" SERIAL NOT NULL, "username" character varying(255), "password_hash" character varying(255), "email" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "google_id" character varying(255), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_7adac5c0b28492eb292d4a93871" UNIQUE ("google_id"), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "user_crossword" ("user_crossword_id" SERIAL NOT NULL, "grid_state" text, "completed" boolean NOT NULL DEFAULT false, "last_attempted" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, "crossword_id" integer, CONSTRAINT "PK_061ab7644dbb204e1fdcba11440" PRIMARY KEY ("user_crossword_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx_user_crossword_progress_user_id" ON "user_crossword" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx_user_crossword_progress_crossword_id" ON "user_crossword" ("crossword_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "crossword" ("crossword_id" SERIAL NOT NULL, "title" citext NOT NULL, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "difficulty" integer NOT NULL, "is_Public" boolean NOT NULL DEFAULT true, "language_id" integer, CONSTRAINT "UQ_b9d71fb3238045df24baf9691f9" UNIQUE ("title"), CONSTRAINT "PK_f0956c1108f3c1364ce8d744e8c" PRIMARY KEY ("crossword_id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "crossword_topics" ("crossword_id" integer NOT NULL, "topic_id" integer NOT NULL, CONSTRAINT "PK_fd39a2198c96f352abf2c6ecb49" PRIMARY KEY ("crossword_id", "topic_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_e952e18990faeaba0168517548" ON "crossword_topics" ("crossword_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_01811ea4736f476074fa3f83e9" ON "crossword_topics" ("topic_id") `,
		);
		await queryRunner.query(
			`ALTER TABLE "topic" ADD CONSTRAINT "FK_243779a8e79710b0cbe3afa9983" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "words" ADD CONSTRAINT "FK_25045efb051717ad2b3c26b6106" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_word" ADD CONSTRAINT "FK_077548b02aa040278f906ddc458" FOREIGN KEY ("crossword_id") REFERENCES "crossword"("crossword_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_word" ADD CONSTRAINT "FK_2962f83ea477254b91f78b88531" FOREIGN KEY ("word_id") REFERENCES "words"("word_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" ADD CONSTRAINT "FK_a2095efe9d0db64ef8c615ba360" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" ADD CONSTRAINT "FK_b83c1bf8825c9cf98395c0bb490" FOREIGN KEY ("crossword_id") REFERENCES "crossword"("crossword_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword" ADD CONSTRAINT "FK_f2d0c8d723e64df51514fdb4b49" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_topics" ADD CONSTRAINT "FK_e952e18990faeaba01685175489" FOREIGN KEY ("crossword_id") REFERENCES "crossword"("crossword_id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_topics" ADD CONSTRAINT "FK_01811ea4736f476074fa3f83e9e" FOREIGN KEY ("topic_id") REFERENCES "topic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "crossword_topics" DROP CONSTRAINT "FK_01811ea4736f476074fa3f83e9e"`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_topics" DROP CONSTRAINT "FK_e952e18990faeaba01685175489"`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword" DROP CONSTRAINT "FK_f2d0c8d723e64df51514fdb4b49"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" DROP CONSTRAINT "FK_b83c1bf8825c9cf98395c0bb490"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" DROP CONSTRAINT "FK_a2095efe9d0db64ef8c615ba360"`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_word" DROP CONSTRAINT "FK_2962f83ea477254b91f78b88531"`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_word" DROP CONSTRAINT "FK_077548b02aa040278f906ddc458"`,
		);
		await queryRunner.query(
			`ALTER TABLE "words" DROP CONSTRAINT "FK_25045efb051717ad2b3c26b6106"`,
		);
		await queryRunner.query(
			`ALTER TABLE "topic" DROP CONSTRAINT "FK_243779a8e79710b0cbe3afa9983"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_01811ea4736f476074fa3f83e9"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_e952e18990faeaba0168517548"`,
		);
		await queryRunner.query(`DROP TABLE "crossword_topics"`);
		await queryRunner.query(`DROP TABLE "crossword"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx_user_crossword_progress_crossword_id"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx_user_crossword_progress_user_id"`,
		);
		await queryRunner.query(`DROP TABLE "user_crossword"`);
		await queryRunner.query(`DROP TABLE "user"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx_crossword_words_word_id"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx_crossword_words_crossword_id"`,
		);
		await queryRunner.query(`DROP TABLE "crossword_word"`);
		await queryRunner.query(`DROP INDEX "public"."idx_words_language_id"`);
		await queryRunner.query(`DROP TABLE "words"`);
		await queryRunner.query(`DROP TABLE "languages"`);
		await queryRunner.query(`DROP TABLE "topic"`);
	}
}
