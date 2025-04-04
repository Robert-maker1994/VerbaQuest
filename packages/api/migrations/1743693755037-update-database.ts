import type { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDatabase1743693755037 implements MigrationInterface {
  name = "UpdateDatabase1743693755037";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "verb_group" ("group_id" SERIAL NOT NULL, "group_name" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_5f6a23730c4e398acdba6bb1e4b" PRIMARY KEY ("group_id")); COMMENT ON COLUMN "verb_group"."group_id" IS 'The unique identifier for this Verb Group.'; COMMENT ON COLUMN "verb_group"."group_name" IS 'The name of the verb group.'; COMMENT ON COLUMN "verb_group"."created_at" IS 'The date and time the verb group was created.'; COMMENT ON COLUMN "verb_group"."updated_at" IS 'The date and time the verb group was last updated.'; COMMENT ON COLUMN "verb_group"."user_id" IS 'The unique identifier for each user.'`,
    );
    await queryRunner.query(`CREATE INDEX "idx_verb_group_user_id" ON "verb_group" ("user_id") `);
    await queryRunner.query(
      `CREATE TABLE "user_verb_group" ("user_verb_group_id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "language_id" integer, "verb_id" integer, "group_id" integer, CONSTRAINT "PK_09d0d98b69de593d2a4386662b4" PRIMARY KEY ("user_verb_group_id")); COMMENT ON COLUMN "user_verb_group"."user_verb_group_id" IS 'The unique identifier for this User Verb Group.'; COMMENT ON COLUMN "user_verb_group"."created_at" IS 'The date and time the user verb group was created.'; COMMENT ON COLUMN "user_verb_group"."updated_at" IS 'The date and time the user verb group was last updated.'; COMMENT ON COLUMN "user_verb_group"."language_id" IS 'The unique identifier for this language.'; COMMENT ON COLUMN "user_verb_group"."verb_id" IS 'The unique identifier for this verb.'; COMMENT ON COLUMN "user_verb_group"."group_id" IS 'The unique identifier for this Verb Group.'`,
    );
    await queryRunner.query(`CREATE INDEX "idx_user_verb_group_language_id" ON "user_verb_group" ("language_id") `);
    await queryRunner.query(`CREATE INDEX "idx_user_verb_id" ON "user_verb_group" ("verb_id") `);
    await queryRunner.query(`CREATE INDEX "idx_user_verb_group_id" ON "user_verb_group" ("group_id") `);
    await queryRunner.query(
      `ALTER TABLE "verb_group" ADD CONSTRAINT "FK_599531f8ad5b978ba697b8c68f5" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verb_group" ADD CONSTRAINT "FK_b1871a632bcbe08e96ee6dae1d7" FOREIGN KEY ("language_id") REFERENCES "languages"("language_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verb_group" ADD CONSTRAINT "FK_375ee50558570d77b7f3063a091" FOREIGN KEY ("verb_id") REFERENCES "verb"("verb_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verb_group" ADD CONSTRAINT "FK_57d599c5e70727e187cc6de24a7" FOREIGN KEY ("group_id") REFERENCES "verb_group"("group_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_verb_group" DROP CONSTRAINT "FK_57d599c5e70727e187cc6de24a7"`);
    await queryRunner.query(`ALTER TABLE "user_verb_group" DROP CONSTRAINT "FK_375ee50558570d77b7f3063a091"`);
    await queryRunner.query(`ALTER TABLE "user_verb_group" DROP CONSTRAINT "FK_b1871a632bcbe08e96ee6dae1d7"`);
    await queryRunner.query(`ALTER TABLE "verb_group" DROP CONSTRAINT "FK_599531f8ad5b978ba697b8c68f5"`);
    await queryRunner.query(`DROP INDEX "public"."idx_user_verb_group_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_user_verb_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_user_verb_group_language_id"`);
    await queryRunner.query(`DROP TABLE "user_verb_group"`);
    await queryRunner.query(`DROP INDEX "public"."idx_verb_group_user_id"`);
    await queryRunner.query(`DROP TABLE "verb_group"`);
  }
}
