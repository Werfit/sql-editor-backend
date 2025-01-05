import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkspaceCascade1735914151027 implements MigrationInterface {
    name = 'WorkspaceCascade1735914151027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "workspace" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "last_edit" TIMESTAMP NOT NULL DEFAULT now(), "creator_id" uuid, CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_c30248dbe746deef511e77d8abd" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace" DROP CONSTRAINT "FK_c30248dbe746deef511e77d8abd"`);
        await queryRunner.query(`DROP TABLE "workspace"`);
    }

}
