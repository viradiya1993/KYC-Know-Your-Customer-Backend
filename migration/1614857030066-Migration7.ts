import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration71614857030066 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    //THIS  WILL ADD 'userType_code' COLUMN IN THE TABLE.
    await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE user_type ADD COLUMN userType_code character varying;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column userType_code already exists in user_type.';
            END;
        END;
    $$`);
    //THIS WILL ADD 'owner' COLUMN IN THE TABLE.
    await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE public."user" ADD COLUMN owner boolean NOT NULL DEFAULT false;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column owner already exists in public."user".';
            END;
        END;
    $$`); 

    await queryRunner.query(`UPDATE user_type SET userType_code = 'COMPANY_ADMIN' WHERE pk = 7 AND name = 'Company Admin'`); 
    await queryRunner.query(`ALTER TABLE client ALTER COLUMN processed SET DEFAULT FALSE`);
    await queryRunner.query(`ALTER TABLE client ALTER COLUMN deactivated SET DEFAULT FALSE`);
    await queryRunner.query(`ALTER TABLE public.user ALTER COLUMN password DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE user_type DROP COLUMN userType_code`);
        await queryRunner.query(`ALTER TABLE user DROP COLUMN owner`);
    }

}
