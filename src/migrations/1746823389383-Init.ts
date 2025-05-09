import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1746823389383 implements MigrationInterface {
    name = 'Init1746823389383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
    }

}
