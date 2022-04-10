import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration61614606361502 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL CREATE A NEW TABLE.
        await queryRunner.query(`DO
        $do$
        BEGIN
        IF NOT EXISTS (SELECT * from INFORMATION_SCHEMA.Tables WHERE Table_name = 'wrapper_details') THEN
        CREATE TABLE public.wrapper_details
        (
            wrapper_fk bigint NOT NULL,
            date_created timestamp without time zone,
            active boolean NOT NULL,
            live_mode_endpoint character varying COLLATE pg_catalog."default",
            form_json json,
            test_mode_endpoint character varying COLLATE pg_catalog."default",
            id bigint NOT NULL,
            CONSTRAINT wrapper_details_pkey PRIMARY KEY (id),
            CONSTRAINT wrapper_fk FOREIGN KEY (wrapper_fk)
                REFERENCES public.wrapper (pk) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
        )
        WITH (
            OIDS = FALSE
        )
        TABLESPACE pg_default;

        ALTER TABLE public.wrapper_details
            OWNER to postgres;
        else
            RAISE INFO 'Exists';
        end if;
        end;
        $do$`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE public.wrapper_details`);
    }

}