import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration251617960690330 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD 'service_type' COLUMN IN THE TABLE
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE wrapper ADD COLUMN service_type character varying;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column service_type already exists in wrapper.';
            END;
        END;
    $$`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE wrapper DROP COLUMN service_type`);
    }

}
