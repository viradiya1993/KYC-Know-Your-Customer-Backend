import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration121615971191114 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL UPDATE 'country' COLUMN CONSTRAINT IN THE TABLE settings.
        await queryRunner.query(`DO $$ 
            BEGIN
                BEGIN
                    ALTER TABLE public."client_profile" ALTER COLUMN "country" TYPE varchar(255);
                EXCEPTION
                    WHEN duplicate_column THEN RAISE NOTICE 'column country already exists in client_profile.';
                END;
            END;
        $$`);

        //THIS WILL UPDATE 'state' COLUMN CONSTRAINT IN THE TABLE settings.
        await queryRunner.query(`DO $$ 
            BEGIN
                BEGIN
                    ALTER TABLE public."client_profile" ALTER COLUMN "state" TYPE varchar(255);
                EXCEPTION
                    WHEN duplicate_column THEN RAISE NOTICE 'column state already exists in client_profile.';
                END;
            END;
        $$`);

        //THIS WILL UPDATE 'postalcode' COLUMN CONSTRAINT IN THE TABLE settings.
        await queryRunner.query(`DO $$ 
            BEGIN
                BEGIN
                    ALTER TABLE public."client_profile" ALTER COLUMN "postalcode" TYPE varchar(255);
                EXCEPTION
                    WHEN duplicate_column THEN RAISE NOTICE 'column postalcode already exists in client_profile.';
                END;
            END;
        $$`);

        //THIS WILL UPDATE 'website' COLUMN CONSTRAINT IN THE TABLE settings.
        await queryRunner.query(`DO $$ 
            BEGIN
                BEGIN
                    ALTER TABLE public."client_profile" ALTER COLUMN "website" TYPE varchar(255);
                EXCEPTION
                    WHEN duplicate_column THEN RAISE NOTICE 'column website already exists in client_profile.';
                END;
            END;
        $$`);

        //THIS WILL UPDATE 'date_created' COLUMN CONSTRAINT IN THE TABLE settings.
        await queryRunner.query(`ALTER TABLE public."settings" ALTER COLUMN "date_created" SET DEFAULT CURRENT_TIMESTAMP`);

        //THIS WILL UPDATE 'last_modification' COLUMN CONSTRAINT IN THE TABLE settings.
        await queryRunner.query(`ALTER TABLE public."settings" ALTER COLUMN "last_modification" SET DEFAULT CURRENT_TIMESTAMP`);

        //THIS WILL ADD LANGUAGE SETTINGS IN TABLE setting.
        await queryRunner.query(`DO $$ 
        BEGIN
           INSERT INTO public.settings(
           deleted, created_by, description, name, settingstype, value)
           VALUES (false, 0, 'langualge code', 'LANGUAGE_CODE', 'GENERAL', 'EN');
			EXCEPTION WHEN unique_violation THEN
    		-- Ignore duplicate inserts.
        END;
    $$`);

        //THIS WILL ADD USERTYPE SETTINGS IN TABLE setting.
        await queryRunner.query(`DO $$ 
        BEGIN
           INSERT INTO public.settings(
            deleted, created_by, description, name, settingstype, value)
            VALUES (false, 0, 'usertype code', 'USER_TYPE_CODE', 'GENERAL', 'COMPANY_ADMIN');
			EXCEPTION WHEN unique_violation THEN
    		-- Ignore duplicate inserts.
        END;
    $$`);

        //THIS WILL ADD PRIVILEGE SETTINGS IN TABLE setting.
        await queryRunner.query(`DO $$ 
        BEGIN
           INSERT INTO public.settings(
            deleted, created_by, description, name, settingstype, value)
            VALUES (false, 0, 'Privilege expire time', 'PRIVILEGE_EXPIRY_TIME', 'GENERAL', '10');
			EXCEPTION WHEN unique_violation THEN
    		-- Ignore duplicate inserts.
        END;
    $$`);

        //THIS WILL ADD PRODUCT SETTINGS IN TABLE setting.
        await queryRunner.query(`DO $$ 
        BEGIN
           INSERT INTO public.settings(
            deleted, created_by, description, name, settingstype, value)
            VALUES (false, 0, 'Test', 'PRODUCT_ID', 'GENERAL', '6b4cf441-f495-4390-8c88-014b3e193972');
			EXCEPTION WHEN unique_violation THEN
    		-- Ignore duplicate inserts.
        END;
    $$`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE client_profile DROP COLUMN country`);
        await queryRunner.query(`ALTER TABLE client_profile DROP COLUMN state`);
        await queryRunner.query(`ALTER TABLE client_profile DROP COLUMN postalcode`);
        await queryRunner.query(`ALTER TABLE client_profile DROP COLUMN website`);
    }

}
