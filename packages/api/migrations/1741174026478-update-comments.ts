import type { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateComments1741174026478 implements MigrationInterface {
	name = "UpdateComments1741174026478";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DROP INDEX "public"."idx_user_crossword_progress_user_id"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx_user_crossword_progress_crossword_id"`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_topics" DROP CONSTRAINT "FK_01811ea4736f476074fa3f83e9e"`,
		);
		await queryRunner.query(
			`ALTER TABLE "topic" DROP CONSTRAINT "FK_243779a8e79710b0cbe3afa9983"`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "topic"."topic_id" IS 'The unique identifier for this topic.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "topic"."topic_name" IS 'The name of the topic.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "topic"."language_id" IS 'The unique identifier for this language.'`,
		);
		await queryRunner.query(
			`ALTER TABLE "words" DROP CONSTRAINT "FK_25045efb051717ad2b3c26b6106"`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword" DROP CONSTRAINT "FK_f2d0c8d723e64df51514fdb4b49"`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "languages"."language_id" IS 'The unique identifier for this language.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "languages"."language_code" IS 'The short code for the language (e.g., ''EN'', ''ES'', ''FR'').'`,
		);
		await queryRunner.query(
			`ALTER TYPE "public"."languages_language_name_enum" RENAME TO "languages_language_name_enum_old"`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."languages_language_name_enum" AS ENUM('english', 'spanish', 'french')`,
		);
		await queryRunner.query(
			`ALTER TABLE "languages" ALTER COLUMN "language_name" TYPE "public"."languages_language_name_enum" USING "language_name"::"text"::"public"."languages_language_name_enum"`,
		);
		await queryRunner.query(
			`DROP TYPE "public"."languages_language_name_enum_old"`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "languages"."language_name" IS 'The full name of the language (e.g., ''english'', ''spanish'', ''french'').'`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_word" DROP CONSTRAINT "FK_2962f83ea477254b91f78b88531"`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "words"."word_id" IS 'The unique identifier for this word.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "words"."word_text" IS 'The text of the word.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "words"."definition" IS 'The definition of the word.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "words"."wordle_valid" IS 'Whether this word is valid for Wordle.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "words"."language_id" IS 'The unique identifier for this language.'`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_word" DROP CONSTRAINT "FK_077548b02aa040278f906ddc458"`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_word" DROP CONSTRAINT "UQ_1c6bac704152540d25a3ec23ab2"`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword_word"."crossword_word_id" IS 'The unique identifier for this CrosswordWord record.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword_word"."clue" IS 'The clue for this word in the associated crossword.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword_word"."crossword_id" IS 'The unique identifier for this crossword.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword_word"."word_id" IS 'The unique identifier for this word.'`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" DROP CONSTRAINT "FK_a2095efe9d0db64ef8c615ba360"`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user"."user_id" IS 'The unique identifier for each user.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user"."username" IS 'The unique username of the user.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user"."password_hash" IS 'The hashed password of the user (can be null).'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user"."email" IS 'The email address of the user'`,
		);
		await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
		await queryRunner.query(
			`ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user"."created_at" IS 'The timestamp of when the user was created'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user"."google_id" IS 'The unique Google ID of the user'`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" DROP CONSTRAINT "FK_b83c1bf8825c9cf98395c0bb490"`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user_crossword"."user_crossword_id" IS 'The unique identifier for this UserCrossword record.'`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" ALTER COLUMN "user_id" SET NOT NULL`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user_crossword"."user_id" IS 'Foreign key to the Users table, representing the user who completed the crossword.'`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" ALTER COLUMN "crossword_id" SET NOT NULL`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user_crossword"."crossword_id" IS 'Foreign key to the Crossword table, representing the completed crossword.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user_crossword"."grid_state" IS 'The saved state of the crossword grid for the user'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user_crossword"."completed" IS 'Indicates if the user has completed this crossword.'`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" DROP COLUMN "last_attempted"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" ADD "last_attempted" TIMESTAMP NOT NULL DEFAULT now()`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user_crossword"."last_attempted" IS 'The last time this crossword was attempted by the user.'`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_topics" DROP CONSTRAINT "FK_e952e18990faeaba01685175489"`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword"."crossword_id" IS 'The unique identifier for this crossword.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword"."title" IS 'The title of the crossword puzzle.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword"."date_created" IS 'The date and time the crossword was created.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword"."difficulty" IS 'The difficulty level of the crossword.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword"."is_Public" IS 'Indicates whether this crossword is publicly available.'`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword"."language_id" IS 'The unique identifier for this language.'`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "idx_topic_name" ON "topic" ("topic_name") `,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_word" ADD CONSTRAINT "UQ_1c6bac704152540d25a3ec23ab2" UNIQUE ("crossword_id", "word_id")`,
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
			`ALTER TABLE "crossword_word" DROP CONSTRAINT "UQ_1c6bac704152540d25a3ec23ab2"`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx_topic_name"`);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword"."language_id" IS NULL`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword"."is_Public" IS NULL`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword"."difficulty" IS NULL`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword"."date_created" IS NULL`,
		);
		await queryRunner.query(`COMMENT ON COLUMN "crossword"."title" IS NULL`);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword"."crossword_id" IS NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_topics" ADD CONSTRAINT "FK_e952e18990faeaba01685175489" FOREIGN KEY ("crossword_id") REFERENCES "crossword"("crossword_id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user_crossword"."last_attempted" IS 'The last time this crossword was attempted by the user.'`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" DROP COLUMN "last_attempted"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" ADD "last_attempted" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user_crossword"."completed" IS NULL`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user_crossword"."grid_state" IS NULL`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user_crossword"."crossword_id" IS NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" ALTER COLUMN "crossword_id" DROP NOT NULL`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user_crossword"."user_id" IS NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" ALTER COLUMN "user_id" DROP NOT NULL`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "user_crossword"."user_crossword_id" IS NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" ADD CONSTRAINT "FK_b83c1bf8825c9cf98395c0bb490" FOREIGN KEY ("crossword_id") REFERENCES "crossword"("crossword_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(`COMMENT ON COLUMN "user"."google_id" IS NULL`);
		await queryRunner.query(
			`COMMENT ON COLUMN "user"."created_at" IS 'The timestamp of when the user was created'`,
		);
		await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
		await queryRunner.query(
			`ALTER TABLE "user" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
		);
		await queryRunner.query(`COMMENT ON COLUMN "user"."email" IS NULL`);
		await queryRunner.query(`COMMENT ON COLUMN "user"."password_hash" IS NULL`);
		await queryRunner.query(`COMMENT ON COLUMN "user"."username" IS NULL`);
		await queryRunner.query(`COMMENT ON COLUMN "user"."user_id" IS NULL`);
		await queryRunner.query(
			`ALTER TABLE "user_crossword" ADD CONSTRAINT "FK_a2095efe9d0db64ef8c615ba360" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword_word"."word_id" IS NULL`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword_word"."crossword_id" IS NULL`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword_word"."clue" IS NULL`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "crossword_word"."crossword_word_id" IS NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_word" ADD CONSTRAINT "UQ_1c6bac704152540d25a3ec23ab2" UNIQUE ("crossword_id", "word_id")`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_word" ADD CONSTRAINT "FK_077548b02aa040278f906ddc458" FOREIGN KEY ("crossword_id") REFERENCES "crossword"("crossword_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(`COMMENT ON COLUMN "words"."language_id" IS NULL`);
		await queryRunner.query(`COMMENT ON COLUMN "words"."wordle_valid" IS NULL`);
		await queryRunner.query(`COMMENT ON COLUMN "words"."definition" IS NULL`);
		await queryRunner.query(`COMMENT ON COLUMN "words"."word_text" IS NULL`);
		await queryRunner.query(`COMMENT ON COLUMN "words"."word_id" IS NULL`);
		await queryRunner.query(
			`ALTER TABLE "crossword_word" ADD CONSTRAINT "FK_2962f83ea477254b91f78b88531" FOREIGN KEY ("word_id") REFERENCES "words"("word_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "languages"."language_name" IS NULL`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."languages_language_name_enum_old" AS ENUM('english', 'france', 'spanish')`,
		);
		await queryRunner.query(
			`ALTER TABLE "languages" ALTER COLUMN "language_name" TYPE "public"."languages_language_name_enum_old" USING "language_name"::"text"::"public"."languages_language_name_enum_old"`,
		);
		await queryRunner.query(
			`DROP TYPE "public"."languages_language_name_enum"`,
		);
		await queryRunner.query(
			`ALTER TYPE "public"."languages_language_name_enum_old" RENAME TO "languages_language_name_enum"`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "languages"."language_code" IS NULL`,
		);
		await queryRunner.query(
			`COMMENT ON COLUMN "languages"."language_id" IS NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword" ADD CONSTRAINT "FK_f2d0c8d723e64df51514fdb4b49" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "words" ADD CONSTRAINT "FK_25045efb051717ad2b3c26b6106" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(`COMMENT ON COLUMN "topic"."language_id" IS NULL`);
		await queryRunner.query(`COMMENT ON COLUMN "topic"."topic_name" IS NULL`);
		await queryRunner.query(`COMMENT ON COLUMN "topic"."topic_id" IS NULL`);
		await queryRunner.query(
			`ALTER TABLE "topic" ADD CONSTRAINT "FK_243779a8e79710b0cbe3afa9983" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "crossword_topics" ADD CONSTRAINT "FK_01811ea4736f476074fa3f83e9e" FOREIGN KEY ("topic_id") REFERENCES "topic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx_user_crossword_progress_crossword_id" ON "user_crossword" ("crossword_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx_user_crossword_progress_user_id" ON "user_crossword" ("user_id") `,
		);
	}
}
