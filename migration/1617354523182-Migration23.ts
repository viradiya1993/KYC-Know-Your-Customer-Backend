import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration231617354523182 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE public."client" ADD COLUMN organizationBaseId character varying DEFAULT null;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column organizationBaseId already exists in public."client"';
            END;
        END;
    $$`);

    await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE public."wrapper" ADD COLUMN verification_type character varying DEFAULT null;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column verification_type already exists in public."wrapper"';
            END;
        END;
    $$`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE client DROP COLUMN organizationBaseId`);
        await queryRunner.query(`ALTER TABLE wrapper DROP COLUMN verification_type`);
    }
}