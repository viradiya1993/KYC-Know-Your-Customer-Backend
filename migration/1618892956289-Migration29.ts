import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration291618892956289 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD SESSION_INTERVAL COLUMN TO CHECK WALLET BALANCE.
        await queryRunner.query(`DO $$ 
        BEGIN
           INSERT INTO public.settings(
            deleted, created_by, description, name, settingstype, value)
            VALUES (false, 0, 'Session interval.', 'SESSION_INTERVAL', 'GENERAL', '60');
			EXCEPTION WHEN unique_violation THEN
    		-- Ignore duplicate inserts.
        END;
    $$`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
