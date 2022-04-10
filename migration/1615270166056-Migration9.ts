import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration91615270166056 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public."client" ALTER COLUMN "date_created" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE public."client" ALTER COLUMN "last_modification" SET DEFAULT CURRENT_TIMESTAMP`);
        //This will set the value for the identity column.
        // await queryRunner.query(`select pg_catalog.setval(pg_get_serial_sequence('public.client', 'pk'), (SELECT MAX(pk) FROM public.client)+1);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
