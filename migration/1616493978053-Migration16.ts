import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration161616493978053 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD RANGE FOR AUTO-GENERATED COLUMN FOR BULK JOB ID IN TABLE setting.
        await queryRunner.query(`DO $$ 
        BEGIN
           INSERT INTO public.settings(
            deleted, created_by, description, name, settingstype, value)
            VALUES (false, 0, 'Min-Max Range for bulk job id.', 'BULK_JOB_AUTO_ID', 'GENERAL', '6');
			EXCEPTION WHEN unique_violation THEN
    		-- Ignore duplicate inserts.
        END;
    $$`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
