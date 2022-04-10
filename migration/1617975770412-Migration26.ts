import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration261617975770412 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD 'header_description' COLUMN IN THE TABLE
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE wrapper ADD COLUMN header_description character varying;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column header_description already exists in wrapper.';
            END;
        END;
    $$`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE wrapper DROP COLUMN header_description`);
    }

}
