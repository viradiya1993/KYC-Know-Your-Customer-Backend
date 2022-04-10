import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration331619778832486 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD FREE_RC_VERIFICATION COLUMN TO FREE RC VERIFICATION.
        await queryRunner.query(`DO $$ 
            BEGIN
            INSERT INTO public.settings(
                deleted, created_by, description, name, settingstype, value)
                VALUES (false, 0, 'Free rc verification', 'FREE_RC_VERIFICATION', 'GENERAL', 'true');
                EXCEPTION WHEN unique_violation THEN
                -- Ignore duplicate inserts.
            END;
        $$`);

        //THIS WILL ADD RC_VERIFICATION_ATTEMPTS COLUMN TO CHECK RC VERIFICATION ATTEMPTS.
        await queryRunner.query(`DO $$ 
            BEGIN
            INSERT INTO public.settings(
                deleted, created_by, description, name, settingstype, value)
                VALUES (false, 0, 'Rc verification attempts', 'RC_VERIFICATION_ATTEMPTS', 'GENERAL', '0');
                EXCEPTION WHEN unique_violation THEN
                -- Ignore duplicate inserts.
            END;
        $$`);

        //THIS WILL ADD EMAIL_SENDER COLUMN.
        await queryRunner.query(`DO $$ 
            BEGIN
            INSERT INTO public.settings(
                deleted, created_by, description, name, settingstype, value)
                VALUES (false, 0, 'Sender email address', 'EMAIL_SENDER', 'GENERAL', 'noreply@seamfix.com');
                EXCEPTION WHEN unique_violation THEN
                -- Ignore duplicate inserts.
            END;
        $$`);


        //THIS WILL ADD SIGN_UP_RECIPIENT_LIST COLUMN.
        await queryRunner.query(`DO $$ 
            BEGIN
            INSERT INTO public.settings(
                deleted, created_by, description, name, settingstype, value)
                VALUES (false, 0, 'sign up recipient list', 'SIGN_UP_RECIPIENT_LIST', 'GENERAL', 'oajah@seamfix.com, coliver@seamfix.com');
                EXCEPTION WHEN unique_violation THEN
                -- Ignore duplicate inserts.
            END;
        $$`);

        //THIS WILL ADD SIGN_UP_RECIPIENT_LIST COLUMN.
        await queryRunner.query(`DO $$ 
            BEGIN
            INSERT INTO public.settings(
                deleted, created_by, description, name, settingstype, value)
                VALUES (false, 0, 'sign up email subject', 'SIGNUP_EMAIL_SUBJECT', 'GENERAL', 'You have a new customer!');
                EXCEPTION WHEN unique_violation THEN
                -- Ignore duplicate inserts.
            END;
        $$`);

        //THIS WILL ADD EMAIL_API_BASE_URL COLUMN.
        await queryRunner.query(`DO $$ 
            BEGIN
            INSERT INTO public.settings(
                deleted, created_by, description, name, settingstype, value)
                VALUES (false, 0, 'Send email base URL', 'EMAIL_API_BASE_URL', 'GENERAL', 'http://stg-base-services.seamfix.com/messaging-service-upgrade');
                EXCEPTION WHEN unique_violation THEN
                -- Ignore duplicate inserts.
            END;
        $$`);

        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
