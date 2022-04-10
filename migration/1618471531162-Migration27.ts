import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration271618471531162 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD DEFAULT_WALLET_AMOUNT COLUMN TO CHECK WALLET BALANCE.
        await queryRunner.query(`DO $$ 
        BEGIN
           INSERT INTO public.settings(
            deleted, created_by, description, name, settingstype, value)
            VALUES (false, 0, 'Wallet auth token.', 'WALLET_AUTH_TOKEN', 'GENERAL', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiYmF1dGgiXSwidXNlcl9uYW1lIjoidW9udW9oYUBzZWFtZml4LmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJ1c2VyVHlwZSI6IkJJTExFUiIsImV4cCI6MTczNjA3MDM4MSwidXNlcklkIjoxLCJqdGkiOiIxMzU2YTY5Yi1kMmUyLTQwM2EtYWRjMC00OTZiOTI0NDg3ZGEiLCJlbWFpbCI6InVvbnVvaGFAc2VhbWZpeC5jb20iLCJjbGllbnRfaWQiOiJ1YXV0aCIsInVzZXJuYW1lIjoidW9udW9oYUBzZWFtZml4LmNvbSJ9.vK4wAtRatr4y6HUB0y8iD5OdEh31mL1aOY7R3KXTpIc');
			EXCEPTION WHEN unique_violation THEN
    		-- Ignore duplicate inserts.
        END;
    $$`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
