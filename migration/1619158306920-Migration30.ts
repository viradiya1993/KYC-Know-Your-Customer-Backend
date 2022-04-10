import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration301619158306920 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE public."user" ADD COLUMN email_consent boolean NOT NULL DEFAULT false;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column email_consent already exists in public."user".';
            END;
        END;
    $$`); 

    await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE public."user" ADD COLUMN promotion_consent boolean NOT NULL DEFAULT false;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column promotion_consent already exists in public."user".';
            END;
        END;
    $$`); 

    await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE public."user" ADD COLUMN email_consent_date timestamp without time zone;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column email_consent_date already exists in public."user".';
            END;
        END;
    $$`); 

    await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE public."user" ADD COLUMN promotion_consent_date timestamp without time zone;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column promotion_consent_date already exists in public."user".';
            END;
        END;
    $$`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public."user" DROP COLUMN email_consent`);
        await queryRunner.query(`ALTER TABLE public."user" DROP COLUMN promotion_consent`);
        await queryRunner.query(`ALTER TABLE public."user" DROP COLUMN email_consent_date`);
        await queryRunner.query(`ALTER TABLE public."user" DROP COLUMN promotion_consent_date`);
    }

}
