import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration191617184090409 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD '_mode' COLUMN IN THE TABLE.
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE invocations ADD COLUMN _mode character varying;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column _mode already exists in invocations.';
            END;
        END;
    $$`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE invocations DROP COLUMN _mode`);
    }

}
