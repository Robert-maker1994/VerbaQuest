import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1742683408179 implements MigrationInterface {
	name = "CreateDatabase1742683408179";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user_crossword" ADD CONSTRAINT "UQ_4f3b9af7466ea3d37d025875db3" UNIQUE ("user_id", "crossword_id")`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user_crossword" DROP CONSTRAINT "UQ_4f3b9af7466ea3d37d025875db3"`,
		);
	}
}
