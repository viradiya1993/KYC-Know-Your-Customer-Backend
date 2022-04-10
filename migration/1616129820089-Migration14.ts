import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration141616129820089 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        //THIS WILL CREATE A BAND NEW TABLE.
        await queryRunner.query(`DO
        $do$
        BEGIN
        IF NOT EXISTS (SELECT * from INFORMATION_SCHEMA.Tables WHERE Table_name = 'band') THEN
        CREATE TABLE public.band
        (
            pk bigint NOT NULL,
            custom boolean,
            band_price bigint,
            band_name character varying(255) COLLATE pg_catalog."default",
            minimum_units bigint,
            maximum_units bigint,
            order_date time without time zone,
            created_by bigint,
            active boolean DEFAULT false,
            CONSTRAINT band_pkey PRIMARY KEY (pk),
            CONSTRAINT band_name UNIQUE (band_name)
        )
        WITH (
            OIDS = FALSE
        )
        TABLESPACE pg_default;
        
        ALTER TABLE public.band
            OWNER to postgres;
        else
            RAISE INFO 'Exists';
        end if;
        end;
        $do$`);

        //THIS WILL CREATE A CUSTOMER BAND NEW TABLE.
        await queryRunner.query(`DO
        $do$
        BEGIN
        IF NOT EXISTS (SELECT * from INFORMATION_SCHEMA.Tables WHERE Table_name = 'customer_bands') THEN
        CREATE TABLE public.customer_bands
        (
            pk bigint NOT NULL,
            wrapper_service_provider_fk bigint NOT NULL,
            client_fk bigint NOT NULL,
            band_fk bigint NOT NULL,
            band_order bigint,
            current_band boolean,
            CONSTRAINT customer_bands_pkey PRIMARY KEY (pk),
            CONSTRAINT band_fk FOREIGN KEY (band_fk)
                REFERENCES public.band (pk) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION,
            CONSTRAINT client_fk FOREIGN KEY (client_fk)
                REFERENCES public.client (pk) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION,
            CONSTRAINT wrapper_service_provider_fk FOREIGN KEY (wrapper_service_provider_fk)
                REFERENCES public.verification_service_provider (pk) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
        )
        WITH (
            OIDS = FALSE
        )
        TABLESPACE pg_default;

        ALTER TABLE public.customer_bands
            OWNER to postgres;
        else
            RAISE INFO 'Exists';
        end if;
        end;
        $do$`);

        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE public.customer_bands`);
        await queryRunner.query(`DROP TABLE public.band`);
    }

}
