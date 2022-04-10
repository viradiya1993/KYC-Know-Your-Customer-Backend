import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration221617264838132 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL CREATE A Bank TABLE.
        await queryRunner.query(`DO
        $do$
        BEGIN
        IF NOT EXISTS (SELECT * from INFORMATION_SCHEMA.Tables WHERE Table_name = 'virtual_account') THEN
        CREATE TABLE public.virtual_account
    (
    pk bigint NOT NULL DEFAULT nextval('hibernate_sequence'::regclass),
    "account_number" character varying COLLATE pg_catalog."default",
    create_date timestamp without time zone,
    active boolean,
    wallet_fk bigint,
    bank_fk bigint,
    CONSTRAINT virtual_account_pkey PRIMARY KEY (pk),
    CONSTRAINT bank_fk FOREIGN KEY (bank_fk)
        REFERENCES public.bank (pk) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT wallet_fk FOREIGN KEY (wallet_fk)
        REFERENCES public.wallet (pk) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

    ALTER TABLE public.virtual_account
    OWNER to postgres;
        else
        
            RAISE INFO 'Exists';
        
        end if;
        end;
        $do$`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE public.virtual_account`);
    }

}
