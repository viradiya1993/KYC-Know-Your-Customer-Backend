import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration281618829138551 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD IDLE_TIMEOUT_SECONDS COLUMN TO CHECK WALLET BALANCE.
        await queryRunner.query(`DO $$ 
        BEGIN
           INSERT INTO public.settings(
            deleted, created_by, description, name, settingstype, value)
            VALUES (false, 0, 'Session time out.', 'IDLE_TIMEOUT_SECONDS', 'GENERAL', '900');
			EXCEPTION WHEN unique_violation THEN
    		-- Ignore duplicate inserts.
        END;
    $$`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
