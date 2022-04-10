import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration151616480592131 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE public."user" ADD COLUMN base_user_id character varying DEFAULT null;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column base_user_id already exists in public."user"';
            END;
        END;
    $$`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE user DROP COLUMN base_user_id`);
    }

}
