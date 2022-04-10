import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration111615363902913 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD 'bulk_template_link' COLUMN IN THE TABLE.
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE wrapper ADD COLUMN bulk_template_link character varying;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column bulk_template_link already exists in wrapper.';
            END;
        END;
    $$`); 

    //THIS WILL ADD 'bulk_enabled' COLUMN IN THE TABLE.
    await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE wrapper ADD COLUMN bulk_enabled boolean NOT NULL DEFAULT false;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column bulk_enabled already exists in wrapper.';
            END;
        END;
    $$`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE wrapper DROP COLUMN bulk_template_link`);
        await queryRunner.query(`ALTER TABLE wrapper DROP COLUMN bulk_enabled`);
    }

}
