import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration201617264451068 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //THIS WILL CREATE A Wallet TABLE.
        await queryRunner.query(`DO
        $do$
        BEGIN
        IF NOT EXISTS (SELECT * from INFORMATION_SCHEMA.Tables WHERE Table_name = 'wallet') THEN
        CREATE TABLE public.wallet
        (
            pk bigint NOT NULL DEFAULT nextval('hibernate_sequence'::regclass),
            create_date timestamp without time zone,
            last_modified timestamp without time zone,
            active boolean,
            wallet_id character varying COLLATE pg_catalog."default" NOT NULL,
            last_known_balance numeric(19,2),
            "primary" boolean,
            client_fk bigint,
            CONSTRAINT wallet_pkey PRIMARY KEY (pk),
            CONSTRAINT client_fk FOREIGN KEY (client_fk)
                REFERENCES public.client (pk) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
        )
        WITH (
            OIDS = FALSE
        )
        TABLESPACE pg_default;
        
        ALTER TABLE public.wallet
            OWNER to postgres;
        else
        
            RAISE INFO 'Exists';
        
        end if;
        end;
        $do$`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE public.wallet`);
    }

}
