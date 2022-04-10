import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration311619169906650 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE wrapper ADD COLUMN active boolean NOT NULL DEFAULT true;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column active already exists in wrapper.';
            END;
        END;
    $$`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE wrapper DROP COLUMN active`);
    }

}
