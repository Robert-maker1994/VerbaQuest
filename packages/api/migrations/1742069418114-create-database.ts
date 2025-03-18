import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1742069418114 implements MigrationInterface {
	name = "CreateDatabase1742069418114";


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "topic" ("topic_id" SERIAL NOT NULL, "topic_name" citext NOT NULL, "language_id" integer, CONSTRAINT "UQ_b07c38f7593a528dd6d5e85e511" UNIQUE ("topic_name"), CONSTRAINT "PK_d91aa173b2e6549130633b15a2d" PRIMARY KEY ("topic_id")); COMMENT ON COLUMN "topic"."topic_id" IS 'The unique identifier for this topic.'; COMMENT ON COLUMN "topic"."topic_name" IS 'The name of the topic.'; COMMENT ON COLUMN "topic"."language_id" IS 'The unique identifier for this language.'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_topic_name" ON "topic" ("topic_name") `);
        await queryRunner.query(`CREATE TYPE "public"."languages_language_code_enum" AS ENUM('EN', 'ES', 'FR')`);
        await queryRunner.query(`CREATE TYPE "public"."languages_language_name_enum" AS ENUM('english', 'spanish', 'french')`);
        await queryRunner.query(`CREATE TABLE "languages" ("language_id" SERIAL NOT NULL, "language_code" "public"."languages_language_code_enum" NOT NULL, "language_name" "public"."languages_language_name_enum" NOT NULL, CONSTRAINT "PK_108420613c85f301619cf49234d" PRIMARY KEY ("language_id")); COMMENT ON COLUMN "languages"."language_id" IS 'The unique identifier for this language.'; COMMENT ON COLUMN "languages"."language_code" IS 'The short code for the language (e.g., ''EN'', ''ES'', ''FR'').'; COMMENT ON COLUMN "languages"."language_name" IS 'The full name of the language (e.g., ''english'', ''spanish'', ''french'').'`);
        await queryRunner.query(`CREATE TABLE "words" ("word_id" SERIAL NOT NULL, "word_text" citext NOT NULL, "definition" citext NOT NULL, "wordle_valid" boolean NOT NULL DEFAULT false, "language_id" integer, CONSTRAINT "UQ_1eee62f27091adcba5cc43c1ee2" UNIQUE ("word_text"), CONSTRAINT "PK_f5938f158c76372fb10397a67ab" PRIMARY KEY ("word_id")); COMMENT ON COLUMN "words"."word_id" IS 'The unique identifier for this word.'; COMMENT ON COLUMN "words"."word_text" IS 'The text of the word.'; COMMENT ON COLUMN "words"."definition" IS 'The definition of the word.'; COMMENT ON COLUMN "words"."wordle_valid" IS 'Whether this word is valid for Wordle.'; COMMENT ON COLUMN "words"."language_id" IS 'The unique identifier for this language.'`);
        await queryRunner.query(`CREATE INDEX "idx_words_language_id" ON "words" ("language_id") `);
        await queryRunner.query(`CREATE TABLE "crossword_word" ("crossword_word_id" SERIAL NOT NULL, "clue" text NOT NULL, "crossword_id" integer, "word_id" integer, CONSTRAINT "UQ_1c6bac704152540d25a3ec23ab2" UNIQUE ("crossword_id", "word_id"), CONSTRAINT "PK_3a6d4504682127e83fa0cf3ddb8" PRIMARY KEY ("crossword_word_id")); COMMENT ON COLUMN "crossword_word"."crossword_word_id" IS 'The unique identifier for this CrosswordWord record.'; COMMENT ON COLUMN "crossword_word"."clue" IS 'The clue for this word in the associated crossword.'; COMMENT ON COLUMN "crossword_word"."crossword_id" IS 'The unique identifier for this crossword.'; COMMENT ON COLUMN "crossword_word"."word_id" IS 'The unique identifier for this word.'`);
        await queryRunner.query(`CREATE INDEX "idx_crossword_words_crossword_id" ON "crossword_word" ("crossword_id") `);
        await queryRunner.query(`CREATE INDEX "idx_crossword_words_word_id" ON "crossword_word" ("word_id") `);
        await queryRunner.query(`CREATE TYPE "public"."user_preferred_learning_language_enum" AS ENUM('EN', 'ES', 'FR')`);
        await queryRunner.query(`CREATE TYPE "public"."user_app_language_enum" AS ENUM('EN', 'ES', 'FR')`);
        await queryRunner.query(`CREATE TYPE "public"."user_preferred_difficulty_enum" AS ENUM('a1', 'a2', 'b1', 'b2', 'c1', 'c2')`);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" SERIAL NOT NULL, "username" character varying(255), "password_hash" character varying(255), "email" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "google_id" character varying(255), "preferred_learning_language" "public"."user_preferred_learning_language_enum" NOT NULL DEFAULT 'ES', "app_language" "public"."user_app_language_enum" NOT NULL DEFAULT 'EN', "preferred_difficulty" "public"."user_preferred_difficulty_enum" NOT NULL DEFAULT 'a1', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_7adac5c0b28492eb292d4a93871" UNIQUE ("google_id"), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id")); COMMENT ON COLUMN "user"."user_id" IS 'The unique identifier for each user.'; COMMENT ON COLUMN "user"."username" IS 'The unique username of the user.'; COMMENT ON COLUMN "user"."password_hash" IS 'The hashed password of the user (can be null).'; COMMENT ON COLUMN "user"."email" IS 'The email address of the user'; COMMENT ON COLUMN "user"."created_at" IS 'The timestamp of when the user was created'; COMMENT ON COLUMN "user"."google_id" IS 'The unique Google ID of the user'; COMMENT ON COLUMN "user"."preferred_learning_language" IS 'The users preferred learning language'; COMMENT ON COLUMN "user"."app_language" IS 'The users APP language'; COMMENT ON COLUMN "user"."preferred_difficulty" IS 'The users preferred difficulty for the crosswords'`);
        await queryRunner.query(`CREATE TABLE "user_crossword" ("user_crossword_id" SERIAL NOT NULL, "user_id" integer NOT NULL, "crossword_id" integer NOT NULL, "grid_state" text, "completion_timer" integer, "completed" boolean NOT NULL DEFAULT false, "last_attempted" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_061ab7644dbb204e1fdcba11440" PRIMARY KEY ("user_crossword_id")); COMMENT ON COLUMN "user_crossword"."user_crossword_id" IS 'The unique identifier for this UserCrossword record.'; COMMENT ON COLUMN "user_crossword"."user_id" IS 'Foreign key to the Users table, representing the user who completed the crossword.'; COMMENT ON COLUMN "user_crossword"."crossword_id" IS 'Foreign key to the Crossword table, representing the completed crossword.'; COMMENT ON COLUMN "user_crossword"."grid_state" IS 'The saved state of the crossword grid for the user'; COMMENT ON COLUMN "user_crossword"."completion_timer" IS 'Completion timer in seconds'; COMMENT ON COLUMN "user_crossword"."completed" IS 'Indicates if the user has completed this crossword.'; COMMENT ON COLUMN "user_crossword"."last_attempted" IS 'The last time this crossword was attempted by the user.'`);
        await queryRunner.query(`CREATE TYPE "public"."crossword_difficulty_enum" AS ENUM('a1', 'a2', 'b1', 'b2', 'c1', 'c2')`);
        await queryRunner.query(`CREATE TABLE "crossword" ("crossword_id" SERIAL NOT NULL, "title" citext NOT NULL, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "difficulty" "public"."crossword_difficulty_enum" NOT NULL, "is_Public" boolean NOT NULL DEFAULT true, "language_id" integer, CONSTRAINT "UQ_b9d71fb3238045df24baf9691f9" UNIQUE ("title"), CONSTRAINT "PK_f0956c1108f3c1364ce8d744e8c" PRIMARY KEY ("crossword_id")); COMMENT ON COLUMN "crossword"."crossword_id" IS 'The unique identifier for this crossword.'; COMMENT ON COLUMN "crossword"."title" IS 'The title of the crossword puzzle.'; COMMENT ON COLUMN "crossword"."date_created" IS 'The date and time the crossword was created.'; COMMENT ON COLUMN "crossword"."difficulty" IS 'The level of difficulty of the crossword puzzle.'; COMMENT ON COLUMN "crossword"."is_Public" IS 'Indicates whether this crossword is publicly available.'; COMMENT ON COLUMN "crossword"."language_id" IS 'The unique identifier for this language.'`);
        await queryRunner.query(`CREATE TABLE "crossword_topics" ("crossword_id" integer NOT NULL, "topic_id" integer NOT NULL, CONSTRAINT "PK_fd39a2198c96f352abf2c6ecb49" PRIMARY KEY ("crossword_id", "topic_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e952e18990faeaba0168517548" ON "crossword_topics" ("crossword_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_01811ea4736f476074fa3f83e9" ON "crossword_topics" ("topic_id") `);
        await queryRunner.query(`ALTER TABLE "topic" ADD CONSTRAINT "FK_243779a8e79710b0cbe3afa9983" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "words" ADD CONSTRAINT "FK_25045efb051717ad2b3c26b6106" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "crossword_word" ADD CONSTRAINT "FK_077548b02aa040278f906ddc458" FOREIGN KEY ("crossword_id") REFERENCES "crossword"("crossword_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "crossword_word" ADD CONSTRAINT "FK_2962f83ea477254b91f78b88531" FOREIGN KEY ("word_id") REFERENCES "words"("word_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_crossword" ADD CONSTRAINT "FK_a2095efe9d0db64ef8c615ba360" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_crossword" ADD CONSTRAINT "FK_b83c1bf8825c9cf98395c0bb490" FOREIGN KEY ("crossword_id") REFERENCES "crossword"("crossword_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "crossword" ADD CONSTRAINT "FK_f2d0c8d723e64df51514fdb4b49" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "crossword_topics" ADD CONSTRAINT "FK_e952e18990faeaba01685175489" FOREIGN KEY ("crossword_id") REFERENCES "crossword"("crossword_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "crossword_topics" ADD CONSTRAINT "FK_01811ea4736f476074fa3f83e9e" FOREIGN KEY ("topic_id") REFERENCES "topic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crossword_topics" DROP CONSTRAINT "FK_01811ea4736f476074fa3f83e9e"`);
        await queryRunner.query(`ALTER TABLE "crossword_topics" DROP CONSTRAINT "FK_e952e18990faeaba01685175489"`);
        await queryRunner.query(`ALTER TABLE "crossword" DROP CONSTRAINT "FK_f2d0c8d723e64df51514fdb4b49"`);
        await queryRunner.query(`ALTER TABLE "user_crossword" DROP CONSTRAINT "FK_b83c1bf8825c9cf98395c0bb490"`);
        await queryRunner.query(`ALTER TABLE "user_crossword" DROP CONSTRAINT "FK_a2095efe9d0db64ef8c615ba360"`);
        await queryRunner.query(`ALTER TABLE "crossword_word" DROP CONSTRAINT "FK_2962f83ea477254b91f78b88531"`);
        await queryRunner.query(`ALTER TABLE "crossword_word" DROP CONSTRAINT "FK_077548b02aa040278f906ddc458"`);
        await queryRunner.query(`ALTER TABLE "words" DROP CONSTRAINT "FK_25045efb051717ad2b3c26b6106"`);
        await queryRunner.query(`ALTER TABLE "topic" DROP CONSTRAINT "FK_243779a8e79710b0cbe3afa9983"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01811ea4736f476074fa3f83e9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e952e18990faeaba0168517548"`);
        await queryRunner.query(`DROP TABLE "crossword_topics"`);
        await queryRunner.query(`DROP TABLE "crossword"`);
        await queryRunner.query(`DROP TYPE "public"."crossword_difficulty_enum"`);
        await queryRunner.query(`DROP TABLE "user_crossword"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_preferred_difficulty_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_app_language_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_preferred_learning_language_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_crossword_words_word_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_crossword_words_crossword_id"`);
        await queryRunner.query(`DROP TABLE "crossword_word"`);
        await queryRunner.query(`DROP INDEX "public"."idx_words_language_id"`);
        await queryRunner.query(`DROP TABLE "words"`);
        await queryRunner.query(`DROP TABLE "languages"`);
        await queryRunner.query(`DROP TYPE "public"."languages_language_name_enum"`);
        await queryRunner.query(`DROP TYPE "public"."languages_language_code_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_topic_name"`);
        await queryRunner.query(`DROP TABLE "topic"`);
    }


}
