import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration51613995534910 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        //THIS WILL UPDATE DATA IN WRAPPER_FK.

        await queryRunner.query(`Update invocations 
        SET wrapper_fk = wrapper.pk
        FROM wrapper
        WHERE wrapper.name = invocations.wrapper_name`); 

        //THIS WILL UPDATE DATA IN USER_FK.

        await queryRunner.query(`Update invocations 
        SET user_fk = public."user".pk
        FROM public."user"
        WHERE public."user".userid = invocations.userid`); 

        // //THIS WILL REMOVE COLUMN FROM THE TABLE.
        
        // await queryRunner.query(`ALTER TABLE invocations 
        // DROP COLUMN IF EXISTS wrapper_name,
        // DROP COLUMN IF EXISTS userid`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
