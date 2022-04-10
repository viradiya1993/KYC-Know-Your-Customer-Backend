import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration181616671666250 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD RANGE FOR AUTO-GENERATED COLUMN FOR API-KEY IN TABLE setting.
        await queryRunner.query(`DO $$ 
        BEGIN
           INSERT INTO public.settings(
            deleted, created_by, description, name, settingstype, value)
            VALUES (false, 0, 'Min-Max Range for api key.', 'API_KEY_AUTO_ID', 'GENERAL', '20');
			EXCEPTION WHEN unique_violation THEN
    		-- Ignore duplicate inserts.
        END;
    $$`);

        await queryRunner.query(`ALTER TABLE clientkeys ALTER COLUMN created_by DROP NOT NULL;`);

        //This will set the value for the identity column.
        // await queryRunner.query(`select pg_catalog.setval(pg_get_serial_sequence('public.clientkeys', 'pk'), (SELECT MAX(pk) FROM public.clientkeys)+1);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
