import type { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDatabase1742069418100 implements MigrationInterface {
  name = "UpdateDatabase1742069418100";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "topic" ("topic_id" SERIAL NOT NULL, "topic_name" citext NOT NULL, "language_id" integer, CONSTRAINT "UQ_b07c38f7593a528dd6d5e85e511" UNIQUE ("topic_name"), CONSTRAINT "PK_d91aa173b2e6549130633b15a2d" PRIMARY KEY ("topic_id")); COMMENT ON COLUMN "topic"."topic_id" IS 'The unique identifier for this topic.'; COMMENT ON COLUMN "topic"."topic_name" IS 'The name of the topic.'; COMMENT ON COLUMN "topic"."language_id" IS 'The unique identifier for this language.'`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_topic_name" ON "topic" ("topic_name") `);
    await queryRunner.query(`CREATE TYPE "public"."languages_language_code_enum" AS ENUM('en', 'es', 'fr')`);
    await queryRunner.query(
      `CREATE TYPE "public"."languages_language_name_enum" AS ENUM('English', 'Spanish', 'French')`,
    );
    await queryRunner.query(
      `CREATE TABLE "languages" ("language_id" SERIAL NOT NULL, "language_code" "public"."languages_language_code_enum" NOT NULL, "language_name" "public"."languages_language_name_enum" NOT NULL, CONSTRAINT "PK_108420613c85f301619cf49234d" PRIMARY KEY ("language_id")); COMMENT ON COLUMN "languages"."language_id" IS 'The unique identifier for this language.'; COMMENT ON COLUMN "languages"."language_code" IS 'The short code for the language (e.g., ''EN'', ''ES'', ''FR'').'; COMMENT ON COLUMN "languages"."language_name" IS 'The full name of the language (e.g., ''english'', ''spanish'', ''french'').'`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_crossword" ("user_crossword_id" SERIAL NOT NULL, "user_id" integer NOT NULL, "crossword_id" integer NOT NULL, "grid_state" text, "completion_timer" integer, "completed" boolean NOT NULL DEFAULT false, "last_attempted" TIMESTAMP NOT NULL DEFAULT now(), "is_favorite" boolean NOT NULL DEFAULT false, "is_hidden" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_4f3b9af7466ea3d37d025875db3" UNIQUE ("user_id", "crossword_id"), CONSTRAINT "PK_061ab7644dbb204e1fdcba11440" PRIMARY KEY ("user_crossword_id")); COMMENT ON COLUMN "user_crossword"."user_crossword_id" IS 'The unique identifier for this UserCrossword record.'; COMMENT ON COLUMN "user_crossword"."user_id" IS 'Foreign key to the Users table, representing the user who completed the crossword.'; COMMENT ON COLUMN "user_crossword"."crossword_id" IS 'Foreign key to the Crossword table, representing the completed crossword.'; COMMENT ON COLUMN "user_crossword"."grid_state" IS 'The saved state of the crossword grid for the user'; COMMENT ON COLUMN "user_crossword"."completion_timer" IS 'Completion timer in seconds'; COMMENT ON COLUMN "user_crossword"."completed" IS 'Indicates if the user has completed this crossword.'; COMMENT ON COLUMN "user_crossword"."last_attempted" IS 'The last time this crossword was attempted by the user.'; COMMENT ON COLUMN "user_crossword"."is_favorite" IS 'Indicates if the user has marked this crossword as a favorite.'; COMMENT ON COLUMN "user_crossword"."is_hidden" IS 'Indicates if the user has marked this crossword as a hidden or not.'`,
    );
    await queryRunner.query(`CREATE TYPE "public"."user_preferred_learning_language_enum" AS ENUM('en', 'es', 'fr')`);
    await queryRunner.query(`CREATE TYPE "public"."user_app_language_enum" AS ENUM('en', 'es', 'fr')`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_preferred_difficulty_enum" AS ENUM('a1', 'a2', 'b1', 'b2', 'c1', 'c2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("user_id" SERIAL NOT NULL, "username" character varying(255), "password_hash" character varying(255), "email" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "google_id" character varying(255), "preferred_learning_language" "public"."user_preferred_learning_language_enum" NOT NULL DEFAULT 'es', "app_language" "public"."user_app_language_enum" NOT NULL DEFAULT 'en', "preferred_difficulty" "public"."user_preferred_difficulty_enum" NOT NULL DEFAULT 'a1', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_7adac5c0b28492eb292d4a93871" UNIQUE ("google_id"), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id")); COMMENT ON COLUMN "user"."user_id" IS 'The unique identifier for each user.'; COMMENT ON COLUMN "user"."username" IS 'The unique username of the user.'; COMMENT ON COLUMN "user"."password_hash" IS 'The hashed password of the user (can be null).'; COMMENT ON COLUMN "user"."email" IS 'The email address of the user'; COMMENT ON COLUMN "user"."created_at" IS 'The timestamp of when the user was created'; COMMENT ON COLUMN "user"."google_id" IS 'The unique Google ID of the user'; COMMENT ON COLUMN "user"."preferred_learning_language" IS 'The users preferred learning language'; COMMENT ON COLUMN "user"."app_language" IS 'The users APP language'; COMMENT ON COLUMN "user"."preferred_difficulty" IS 'The users preferred difficulty for the crosswords'`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_word_progress" ("user_word_progress_id" SERIAL NOT NULL, "is_favorite" boolean NOT NULL DEFAULT false, "is_wordle_completed" boolean NOT NULL DEFAULT false, "user_id" integer, "word_id" integer, CONSTRAINT "PK_29cd9fb939404536ca0816017e9" PRIMARY KEY ("user_word_progress_id")); COMMENT ON COLUMN "user_word_progress"."user_id" IS 'The unique identifier for each user.'; COMMENT ON COLUMN "user_word_progress"."word_id" IS 'The unique identifier for this word.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "word" ("word_id" SERIAL NOT NULL, "word_text" citext NOT NULL, "definition" citext NOT NULL, "wordle_valid" boolean NOT NULL DEFAULT false, "partOfSpeech" character varying(50), "language_id" integer, CONSTRAINT "PK_f87480f4326afceac62b04d76c1" PRIMARY KEY ("word_id")); COMMENT ON COLUMN "word"."word_id" IS 'The unique identifier for this word.'; COMMENT ON COLUMN "word"."word_text" IS 'The text of the word.'; COMMENT ON COLUMN "word"."definition" IS 'The definition of the word.'; COMMENT ON COLUMN "word"."wordle_valid" IS 'Whether this word is valid for Wordle.'; COMMENT ON COLUMN "word"."partOfSpeech" IS 'The part of speech (e.g., noun, verb, adjective).'; COMMENT ON COLUMN "word"."language_id" IS 'The unique identifier for this language.'`,
    );
    await queryRunner.query(`CREATE INDEX "idx_words_language_id" ON "word" ("language_id") `);
    await queryRunner.query(
      `CREATE TABLE "crossword_word" ("crossword_word_id" SERIAL NOT NULL, "clue" text NOT NULL, "crossword_id" integer, "word_id" integer, CONSTRAINT "UQ_1c6bac704152540d25a3ec23ab2" UNIQUE ("crossword_id", "word_id"), CONSTRAINT "PK_3a6d4504682127e83fa0cf3ddb8" PRIMARY KEY ("crossword_word_id")); COMMENT ON COLUMN "crossword_word"."crossword_word_id" IS 'The unique identifier for this CrosswordWord record.'; COMMENT ON COLUMN "crossword_word"."clue" IS 'The clue for this word in the associated crossword.'; COMMENT ON COLUMN "crossword_word"."crossword_id" IS 'The unique identifier for this crossword.'; COMMENT ON COLUMN "crossword_word"."word_id" IS 'The unique identifier for this word.'`,
    );
    await queryRunner.query(`CREATE INDEX "idx_crossword_words_crossword_id" ON "crossword_word" ("crossword_id") `);
    await queryRunner.query(`CREATE INDEX "idx_crossword_words_word_id" ON "crossword_word" ("word_id") `);
    await queryRunner.query(
      `CREATE TYPE "public"."crossword_difficulty_enum" AS ENUM('a1', 'a2', 'b1', 'b2', 'c1', 'c2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "crossword" ("crossword_id" SERIAL NOT NULL, "title" citext NOT NULL, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "difficulty" "public"."crossword_difficulty_enum" NOT NULL, "is_Public" boolean NOT NULL DEFAULT true, "language_id" integer, CONSTRAINT "UQ_b9d71fb3238045df24baf9691f9" UNIQUE ("title"), CONSTRAINT "PK_f0956c1108f3c1364ce8d744e8c" PRIMARY KEY ("crossword_id")); COMMENT ON COLUMN "crossword"."crossword_id" IS 'The unique identifier for this crossword.'; COMMENT ON COLUMN "crossword"."title" IS 'The title of the crossword puzzle.'; COMMENT ON COLUMN "crossword"."date_created" IS 'The date and time the crossword was created.'; COMMENT ON COLUMN "crossword"."difficulty" IS 'The level of difficulty of the crossword puzzle.'; COMMENT ON COLUMN "crossword"."is_Public" IS 'Indicates whether this crossword is publicly available.'; COMMENT ON COLUMN "crossword"."language_id" IS 'The unique identifier for this language.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "form" ("form_id" SERIAL NOT NULL, "form" character varying(50) NOT NULL, "language_id" integer, CONSTRAINT "PK_ed84d8e98178872eb4ce8a3ebe7" PRIMARY KEY ("form_id")); COMMENT ON COLUMN "form"."form_id" IS 'The unique identifier for this form.'; COMMENT ON COLUMN "form"."form" IS 'The grammatical form (e.g., yo, tú, él/ella/usted).'; COMMENT ON COLUMN "form"."language_id" IS 'The unique identifier for this language.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "tense" ("tense_id" SERIAL NOT NULL, "tense" character varying(50) NOT NULL, "description" text, "mood" character varying(50), "language_id" integer, CONSTRAINT "PK_f5a3a990ad5fa1da4fcd21330a6" PRIMARY KEY ("tense_id")); COMMENT ON COLUMN "tense"."tense_id" IS 'The unique identifier for this tense.'; COMMENT ON COLUMN "tense"."tense" IS 'The name of the tense (e.g., present, past, future).'; COMMENT ON COLUMN "tense"."description" IS 'Description or path to Markdown file for the tense.'; COMMENT ON COLUMN "tense"."mood" IS 'The mood of the tense (e.g., indicative, subjunctive).'; COMMENT ON COLUMN "tense"."language_id" IS 'The unique identifier for this language.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "verb" ("verb_id" SERIAL NOT NULL, "irregular" boolean NOT NULL DEFAULT false, "word_id" integer, "language_id" integer, CONSTRAINT "PK_3bbad0c86195db8a2b0090da5df" PRIMARY KEY ("verb_id")); COMMENT ON COLUMN "verb"."verb_id" IS 'The unique identifier for this verb.'; COMMENT ON COLUMN "verb"."irregular" IS 'Weather the verb is irregular or not.'; COMMENT ON COLUMN "verb"."word_id" IS 'The unique identifier for this word.'; COMMENT ON COLUMN "verb"."language_id" IS 'The unique identifier for this language.'`,
    );
    await queryRunner.query(`CREATE INDEX "idx_verbs_word_id" ON "verb" ("word_id") `);
    await queryRunner.query(`CREATE INDEX "idx_verbs_language_id" ON "verb" ("language_id") `);
    await queryRunner.query(
      `CREATE TABLE "sentence" ("id" SERIAL NOT NULL, "sentence" text NOT NULL, "translation" text, "conjugation_id" integer, "language_id" integer, CONSTRAINT "PK_eed8b400064f053f70c004b83e7" PRIMARY KEY ("id")); COMMENT ON COLUMN "sentence"."id" IS 'The unique identifier for this sentence.'; COMMENT ON COLUMN "sentence"."sentence" IS 'The example sentence.'; COMMENT ON COLUMN "sentence"."translation" IS 'The translation of the sentence.'; COMMENT ON COLUMN "sentence"."conjugation_id" IS 'The unique identifier for this conjugation.'; COMMENT ON COLUMN "sentence"."language_id" IS 'The unique identifier for this language.'`,
    );
    await queryRunner.query(`CREATE INDEX "idx_sentence_language_id" ON "sentence" ("language_id") `);
    await queryRunner.query(
      `CREATE TABLE "conjugation_translation" ("conjugationTranslationId" SERIAL NOT NULL, "translation" text, "id" integer, "language_id" integer, CONSTRAINT "PK_0fc7aa86ea2fbecfdaa29f2f10d" PRIMARY KEY ("conjugationTranslationId")); COMMENT ON COLUMN "conjugation_translation"."conjugationTranslationId" IS 'The unique identifier for this sentence.'; COMMENT ON COLUMN "conjugation_translation"."translation" IS 'The translation of the conjugation.'; COMMENT ON COLUMN "conjugation_translation"."id" IS 'The unique identifier for this conjugation.'; COMMENT ON COLUMN "conjugation_translation"."language_id" IS 'The unique identifier for this language.'`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_conjugation_translation_language_id" ON "conjugation_translation" ("language_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "conjugation" ("id" SERIAL NOT NULL, "conjugation" character varying(255) NOT NULL, "is_irregular" boolean NOT NULL DEFAULT false, "verb_id" integer, "tense_id" integer, "form_id" integer, CONSTRAINT "PK_c949b63e4be0da576140703b2ad" PRIMARY KEY ("id")); COMMENT ON COLUMN "conjugation"."id" IS 'The unique identifier for this conjugation.'; COMMENT ON COLUMN "conjugation"."conjugation" IS 'The conjugated form of the verb.'; COMMENT ON COLUMN "conjugation"."is_irregular" IS 'If the conjugation is irregular or not.'; COMMENT ON COLUMN "conjugation"."verb_id" IS 'The unique identifier for this verb.'; COMMENT ON COLUMN "conjugation"."tense_id" IS 'The unique identifier for this tense.'; COMMENT ON COLUMN "conjugation"."form_id" IS 'The unique identifier for this form.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "crossword_topics" ("crossword_id" integer NOT NULL, "topic_id" integer NOT NULL, CONSTRAINT "PK_fd39a2198c96f352abf2c6ecb49" PRIMARY KEY ("crossword_id", "topic_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_e952e18990faeaba0168517548" ON "crossword_topics" ("crossword_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_01811ea4736f476074fa3f83e9" ON "crossword_topics" ("topic_id") `);
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "FK_243779a8e79710b0cbe3afa9983" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_crossword" ADD CONSTRAINT "FK_a2095efe9d0db64ef8c615ba360" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_crossword" ADD CONSTRAINT "FK_b83c1bf8825c9cf98395c0bb490" FOREIGN KEY ("crossword_id") REFERENCES "crossword"("crossword_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_word_progress" ADD CONSTRAINT "FK_cf40bfcc7eebd1d3e995f1062ec" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_word_progress" ADD CONSTRAINT "FK_9079eff21093d1ad1cad76be838" FOREIGN KEY ("word_id") REFERENCES "word"("word_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "word" ADD CONSTRAINT "FK_dc68baa5681898fa6059e9e056c" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crossword_word" ADD CONSTRAINT "FK_077548b02aa040278f906ddc458" FOREIGN KEY ("crossword_id") REFERENCES "crossword"("crossword_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crossword_word" ADD CONSTRAINT "FK_2962f83ea477254b91f78b88531" FOREIGN KEY ("word_id") REFERENCES "word"("word_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crossword" ADD CONSTRAINT "FK_f2d0c8d723e64df51514fdb4b49" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "form" ADD CONSTRAINT "FK_8209df728b48ad7688690cbfd78" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tense" ADD CONSTRAINT "FK_405b80a765ffa36512b883db08d" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verb" ADD CONSTRAINT "FK_a6cfdfe55fbae9af9ebd85ad150" FOREIGN KEY ("word_id") REFERENCES "word"("word_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verb" ADD CONSTRAINT "FK_3b10104d82aaa19e5f0e6cd36a0" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sentence" ADD CONSTRAINT "FK_a468e0cf39a874476687f86e1c5" FOREIGN KEY ("conjugation_id") REFERENCES "conjugation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sentence" ADD CONSTRAINT "FK_ce7483484e28cdae677f8ee0ac6" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conjugation_translation" ADD CONSTRAINT "FK_47ddf8ae604b8acfe4d9f93177b" FOREIGN KEY ("id") REFERENCES "conjugation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conjugation_translation" ADD CONSTRAINT "FK_90dab495d8496dd1c9f18cf741f" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conjugation" ADD CONSTRAINT "FK_0cd83eb37226d7ba2e33bd6851a" FOREIGN KEY ("verb_id") REFERENCES "verb"("verb_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conjugation" ADD CONSTRAINT "FK_58ffeba09abf0dff3d2732624b7" FOREIGN KEY ("tense_id") REFERENCES "tense"("tense_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conjugation" ADD CONSTRAINT "FK_154d2a5e7d20fa7575b84620709" FOREIGN KEY ("form_id") REFERENCES "form"("form_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crossword_topics" ADD CONSTRAINT "FK_e952e18990faeaba01685175489" FOREIGN KEY ("crossword_id") REFERENCES "crossword"("crossword_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "crossword_topics" ADD CONSTRAINT "FK_01811ea4736f476074fa3f83e9e" FOREIGN KEY ("topic_id") REFERENCES "topic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "crossword_topics" DROP CONSTRAINT "FK_01811ea4736f476074fa3f83e9e"`);
    await queryRunner.query(`ALTER TABLE "crossword_topics" DROP CONSTRAINT "FK_e952e18990faeaba01685175489"`);
    await queryRunner.query(`ALTER TABLE "conjugation" DROP CONSTRAINT "FK_154d2a5e7d20fa7575b84620709"`);
    await queryRunner.query(`ALTER TABLE "conjugation" DROP CONSTRAINT "FK_58ffeba09abf0dff3d2732624b7"`);
    await queryRunner.query(`ALTER TABLE "conjugation" DROP CONSTRAINT "FK_0cd83eb37226d7ba2e33bd6851a"`);
    await queryRunner.query(`ALTER TABLE "conjugation_translation" DROP CONSTRAINT "FK_90dab495d8496dd1c9f18cf741f"`);
    await queryRunner.query(`ALTER TABLE "conjugation_translation" DROP CONSTRAINT "FK_47ddf8ae604b8acfe4d9f93177b"`);
    await queryRunner.query(`ALTER TABLE "sentence" DROP CONSTRAINT "FK_ce7483484e28cdae677f8ee0ac6"`);
    await queryRunner.query(`ALTER TABLE "sentence" DROP CONSTRAINT "FK_a468e0cf39a874476687f86e1c5"`);
    await queryRunner.query(`ALTER TABLE "verb" DROP CONSTRAINT "FK_3b10104d82aaa19e5f0e6cd36a0"`);
    await queryRunner.query(`ALTER TABLE "verb" DROP CONSTRAINT "FK_a6cfdfe55fbae9af9ebd85ad150"`);
    await queryRunner.query(`ALTER TABLE "tense" DROP CONSTRAINT "FK_405b80a765ffa36512b883db08d"`);
    await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_8209df728b48ad7688690cbfd78"`);
    await queryRunner.query(`ALTER TABLE "crossword" DROP CONSTRAINT "FK_f2d0c8d723e64df51514fdb4b49"`);
    await queryRunner.query(`ALTER TABLE "crossword_word" DROP CONSTRAINT "FK_2962f83ea477254b91f78b88531"`);
    await queryRunner.query(`ALTER TABLE "crossword_word" DROP CONSTRAINT "FK_077548b02aa040278f906ddc458"`);
    await queryRunner.query(`ALTER TABLE "word" DROP CONSTRAINT "FK_dc68baa5681898fa6059e9e056c"`);
    await queryRunner.query(`ALTER TABLE "user_word_progress" DROP CONSTRAINT "FK_9079eff21093d1ad1cad76be838"`);
    await queryRunner.query(`ALTER TABLE "user_word_progress" DROP CONSTRAINT "FK_cf40bfcc7eebd1d3e995f1062ec"`);
    await queryRunner.query(`ALTER TABLE "user_crossword" DROP CONSTRAINT "FK_b83c1bf8825c9cf98395c0bb490"`);
    await queryRunner.query(`ALTER TABLE "user_crossword" DROP CONSTRAINT "FK_a2095efe9d0db64ef8c615ba360"`);
    await queryRunner.query(`ALTER TABLE "topic" DROP CONSTRAINT "FK_243779a8e79710b0cbe3afa9983"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_01811ea4736f476074fa3f83e9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e952e18990faeaba0168517548"`);
    await queryRunner.query(`DROP TABLE "crossword_topics"`);
    await queryRunner.query(`DROP TABLE "conjugation"`);
    await queryRunner.query(`DROP INDEX "public"."idx_conjugation_translation_language_id"`);
    await queryRunner.query(`DROP TABLE "conjugation_translation"`);
    await queryRunner.query(`DROP INDEX "public"."idx_sentence_language_id"`);
    await queryRunner.query(`DROP TABLE "sentence"`);
    await queryRunner.query(`DROP INDEX "public"."idx_verbs_language_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_verbs_word_id"`);
    await queryRunner.query(`DROP TABLE "verb"`);
    await queryRunner.query(`DROP TABLE "tense"`);
    await queryRunner.query(`DROP TABLE "form"`);
    await queryRunner.query(`DROP TABLE "crossword"`);
    await queryRunner.query(`DROP TYPE "public"."crossword_difficulty_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_crossword_words_word_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_crossword_words_crossword_id"`);
    await queryRunner.query(`DROP TABLE "crossword_word"`);
    await queryRunner.query(`DROP INDEX "public"."idx_words_language_id"`);
    await queryRunner.query(`DROP TABLE "word"`);
    await queryRunner.query(`DROP TABLE "user_word_progress"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_preferred_difficulty_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_app_language_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_preferred_learning_language_enum"`);
    await queryRunner.query(`DROP TABLE "user_crossword"`);
    await queryRunner.query(`DROP TABLE "languages"`);
    await queryRunner.query(`DROP TYPE "public"."languages_language_name_enum"`);
    await queryRunner.query(`DROP TYPE "public"."languages_language_code_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_topic_name"`);
    await queryRunner.query(`DROP TABLE "topic"`);
  }
}
