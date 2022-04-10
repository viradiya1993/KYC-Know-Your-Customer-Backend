import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration211617264607554 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL CREATE A Bank TABLE.
        await queryRunner.query(`DO
        $do$
        BEGIN
        IF NOT EXISTS (SELECT * from INFORMATION_SCHEMA.Tables WHERE Table_name = 'bank') THEN
        CREATE TABLE public.bank
    (
        pk bigint NOT NULL DEFAULT nextval('hibernate_sequence'::regclass),
        name character varying COLLATE pg_catalog."default",
        code character varying COLLATE pg_catalog."default",
        active boolean,
        CONSTRAINT bank_pkey PRIMARY KEY (pk)
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

    ALTER TABLE public.bank
    OWNER to postgres;
        else
        
            RAISE INFO 'Exists';
        
        end if;
        end;
        $do$`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE public.bank`);
    }

}
