import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkspaceStatus1736161501382 implements MigrationInterface {
    name = 'WorkspaceStatus1736161501382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace" ADD "status" character varying NOT NULL DEFAULT 'draft'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace" DROP COLUMN "status"`);
    }

}
