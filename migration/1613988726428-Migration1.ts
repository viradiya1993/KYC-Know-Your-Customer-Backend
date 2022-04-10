import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration11613988726428 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD 'LOGO' COLUMN IN THE TABLE.
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE verification_service_provider ADD COLUMN logo character varying;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column logo already exists in verification_service_provider.';
            END;
        END;
    $$`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE verification_service_provider DROP COLUMN logo`);
    }

}
