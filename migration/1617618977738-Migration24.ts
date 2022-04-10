import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration241617618977738 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD DEFAULT_WALLET_AMOUNT COLUMN TO CHECK WALLET BALANCE.
        await queryRunner.query(`DO $$ 
        BEGIN
           INSERT INTO public.settings(
            deleted, created_by, description, name, settingstype, value)
            VALUES (false, 0, 'Default wallet amount.', 'DEFAULT_WALLET_AMOUNT', 'GENERAL', '0.00');
			EXCEPTION WHEN unique_violation THEN
    		-- Ignore duplicate inserts.
        END;
    $$`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
