import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration131616069328573 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DO $$ 
        BEGIN
            BEGIN
                ALTER TABLE client_profile ADD COLUMN yearOfRegistration bigint;
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column yearOfRegistration already exists in client_profile.';
            END;
        END;
    $$`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE client_profile DROP COLUMN yearOfRegistration`);
    }

}
