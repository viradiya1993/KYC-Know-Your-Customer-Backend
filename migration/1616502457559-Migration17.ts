import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration171616502457559 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //This will set the value for the identity column.
        // await queryRunner.query(`select pg_catalog.setval(pg_get_serial_sequence('public.bulk_verifications', 'pk'), (SELECT MAX(pk) FROM public.bulk_verifications)+1);`);
        // await queryRunner.query(`select pg_catalog.setval(pg_get_serial_sequence('public.invocations', 'pk'), (SELECT MAX(pk) FROM public.invocations)+1);`);
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE wrapper ADD COLUMN type character varying(31);
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column type already exists in wrapper.';
            END;
        END;
    $$`);
    await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE invocations ADD COLUMN verification_status_string character varying;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column verification_status_string already exists in invocations.';
            END;
        END;
    $$`); 

    await queryRunner.query(`ALTER TABLE invocations ALTER COLUMN transaction_ref DROP NOT NULL;`); 
    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE wrapper DROP COLUMN type`);
        await queryRunner.query(`ALTER TABLE invocations DROP COLUMN verification_status_string`);
    }

}
