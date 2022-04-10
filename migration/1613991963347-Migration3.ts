import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration31613991963347 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL CREATE A NEW TABLE.
        await queryRunner.query(`DO
        $do$
        BEGIN
        IF NOT EXISTS (SELECT * from INFORMATION_SCHEMA.Tables WHERE Table_name = 'bulk_verifications') THEN
        CREATE TABLE public.bulk_verifications
                (
                    pk bigint NOT NULL DEFAULT nextval('hibernate_sequence'::regclass),
                    bulk_id character varying COLLATE pg_catalog."default" NOT NULL,
                    wrapper_fk bigint,
                    no_of_transaction bigint,
                    user_fk bigint,
                    created_date timestamp without time zone,
                    modified_date timestamp without time zone,
                    status character varying COLLATE pg_catalog."default",
                    success_count bigint,
                    failure_count bigint,
                    CONSTRAINT pk PRIMARY KEY (pk),
                    CONSTRAINT user_fk FOREIGN KEY (user_fk)
                        REFERENCES public."user" (pk) MATCH SIMPLE
                        ON UPDATE NO ACTION
                        ON DELETE NO ACTION,
                    CONSTRAINT wrapper_fk FOREIGN KEY (wrapper_fk)
                        REFERENCES public.wrapper (pk) MATCH SIMPLE
                        ON UPDATE NO ACTION
                        ON DELETE NO ACTION
                )
                WITH (
                    OIDS = FALSE
                )
                TABLESPACE pg_default;
                
                ALTER TABLE public.bulk_verifications
                    OWNER to postgres;
        else
        
            RAISE INFO 'Exists';
        
        end if;
        end;
        $do$`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE public.bulk_verifications`);
    }

}
