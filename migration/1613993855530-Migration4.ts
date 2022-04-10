import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration41613993855530 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL ADD COLUMN AND CONSTRAINT IN THE TABLE. 

        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE invocations ADD COLUMN bulk_fk bigint;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column bulk_fk already exists in invocations.';
            END;
        END;
    $$`); 
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE invocations ADD COLUMN wrapper_fk bigint;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column wrapper_fk already exists in invocations.';
            END;
        END;
    $$`); 
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE invocations ADD COLUMN user_fk bigint;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column user_fk already exists in invocations.';
            END;
        END;
    $$`); 
        
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE invocations ADD COLUMN transaction_type character varying;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column transaction_type already exists in invocations.';
            END;
        END;
    $$`); 
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE invocations ADD COLUMN response_time timestamp without time zone;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column response_time already exists in invocations.';
            END;
        END;
    $$`); 
    
        await queryRunner.query(`DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_fk') THEN
                ALTER TABLE invocations ADD CONSTRAINT user_fk FOREIGN KEY (user_fk) REFERENCES public."user" (pk) ON DELETE NO ACTION ON UPDATE NO ACTION;
            END IF;
        END;
        $$;`);
        await queryRunner.query(`DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'wrapper_fk') THEN
                ALTER TABLE invocations ADD CONSTRAINT wrapper_fk FOREIGN KEY (wrapper_fk) REFERENCES public.wrapper (pk) ON DELETE NO ACTION ON UPDATE NO ACTION;
            END IF;
        END;
        $$;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE invocations DROP COLUMN bulk_fk`);
        await queryRunner.query(`ALTER TABLE invocations DROP COLUMN wrapper_fk`);
        await queryRunner.query(`ALTER TABLE invocations DROP COLUMN user_fk`);
        await queryRunner.query(`ALTER TABLE invocations DROP COLUMN transaction_type`);
        await queryRunner.query(`ALTER TABLE invocations DROP COLUMN response_time`);
        await queryRunner.query(`ALTER TABLE invocations DROP CONSTRAINT user_fk`);
        await queryRunner.query(`ALTER TABLE invocations DROP CONSTRAINT wrapper_fk`);
    }

}
