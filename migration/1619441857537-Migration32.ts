import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration321619441857537 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE public."user" ADD COLUMN is_dismissed_tour boolean NOT NULL DEFAULT false;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column is_dismissed_tour already exists in public."user".';
            END;
        END;
    $$`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public."user" DROP COLUMN is_dismissed_tour`);
    }

}
