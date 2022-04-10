import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration101615282435291 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD 'country' COLUMN IN THE TABLE client_profile.
        await queryRunner.query(`DO $$ 
            BEGIN
                BEGIN
                    ALTER TABLE client_profile ADD COLUMN country character varying DEFAULT null;
                EXCEPTION
                    WHEN duplicate_column THEN RAISE NOTICE 'column country already exists in client_profile.';
                END;
            END;
        $$`); 

        //THIS WILL ADD 'state' COLUMN IN THE TABLE client_profile.
        await queryRunner.query(`DO $$ 
            BEGIN
                BEGIN
                    ALTER TABLE client_profile ADD COLUMN state character varying DEFAULT null;
                EXCEPTION
                    WHEN duplicate_column THEN RAISE NOTICE 'column state already exists in client_profile.';
                END;
            END;
        $$`); 

        //THIS WILL ADD 'postalCode' COLUMN IN THE TABLE client_profile.
        await queryRunner.query(`DO $$ 
            BEGIN
                BEGIN
                    ALTER TABLE client_profile ADD COLUMN postalCode character varying DEFAULT null;
                EXCEPTION
                    WHEN duplicate_column THEN RAISE NOTICE 'column postalCode already exists in client_profile.';
                END;
            END;
        $$`); 

        //THIS WILL ADD 'website' COLUMN IN THE TABLE client_profile.
        await queryRunner.query(`DO $$ 
            BEGIN
                BEGIN
                    ALTER TABLE client_profile ADD COLUMN website character varying DEFAULT null;
                EXCEPTION
                    WHEN duplicate_column THEN RAISE NOTICE 'column website already exists in client_profile.';
                END;
            END;
        $$`); 

        //THIS WILL ADD 'partner' COLUMN IN THE TABLE client_profile.
        await queryRunner.query(`DO $$ 
            BEGIN
                BEGIN
                    ALTER TABLE client_profile ADD COLUMN partner boolean NOT NULL DEFAULT false;
                EXCEPTION
                    WHEN duplicate_column THEN RAISE NOTICE 'column partner already exists in client_profile.';
                END;
            END;
        $$`); 

        //This will set the value for the identity column.
        // await queryRunner.query(`select pg_catalog.setval(pg_get_serial_sequence('public.client_profile', 'pk'), (SELECT MAX(pk) FROM public.client_profile)+1);`);

        //THIS WILL UPDATE 'pk' COLUMN CONSTRAINT IN THE TABLE client_profile.
        await queryRunner.query(`ALTER TABLE public."client_profile" ALTER COLUMN "rcnumber" DROP NOT NULL`);

        //THIS WILL UPDATE 'date_created' COLUMN CONSTRAINT IN THE TABLE client_profile.
        await queryRunner.query(`ALTER TABLE public."client_profile" ALTER COLUMN "date_created" SET DEFAULT CURRENT_TIMESTAMP`);

        //THIS WILL UPDATE 'last_modification' COLUMN CONSTRAINT IN THE TABLE client_profile.
        await queryRunner.query(`ALTER TABLE public."client_profile" ALTER COLUMN "last_modification" SET DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE client_profile DROP COLUMN country`);
        await queryRunner.query(`ALTER TABLE client_profile DROP COLUMN state`);
        await queryRunner.query(`ALTER TABLE client_profile DROP COLUMN postalCode`);
        await queryRunner.query(`ALTER TABLE client_profile DROP COLUMN website`);
        await queryRunner.query(`ALTER TABLE client_profile DROP COLUMN partner`);
    }

}
