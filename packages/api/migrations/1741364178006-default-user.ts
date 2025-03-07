import type { MigrationInterface, QueryRunner } from "typeorm";
import config from "../libs/config";
import { User } from "../libs/entity";

export class DefaultUser1741364178006 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		if (config.authDefaultEmail) {
			await queryRunner.manager.getRepository(User).save([
				{
					username: config.authDefaultUsername,
					password_hash: config.authDefaultPassword,
					email: config.authDefaultEmail,
				},
			]);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		if (config.authDefaultEmail) {
			await queryRunner.manager.getRepository(User).delete({
				username: config.authDefaultUsername,
			});
		}
	}
}
