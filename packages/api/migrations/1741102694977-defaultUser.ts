import type { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../libs/entity";

export class DefaultUser1741102694977 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(User).save([
            {
                username: "verba",
                password_hash: "test1234",
                email: "verba@gmail.com",
            },
        ]);
    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(User).delete({
            username: "verba",
        });
    }

}
