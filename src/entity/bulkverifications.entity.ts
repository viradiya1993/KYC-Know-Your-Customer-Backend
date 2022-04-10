import { Column, Entity, Index, JoinColumn, ManyToOne ,OneToMany,PrimaryGeneratedColumn} from "typeorm";
import { Wrapper } from "./wrapper.entity";
import { Invocations } from "./invocations.entity";

@Index("pk", ["pk"], { unique: true })
@Entity("bulk_verifications", { schema: "public" })
export class BulkVerifications {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column("character varying", { name: "bulk_id"})
    bulk_id: string | null;

    @Column("bigint", { name: "no_of_transaction" })
    no_of_transaction: string;

    @Column("timestamp without time zone", {
       name: "created_date",
       nullable: true,
    })
    created_date: Date | null;

    @Column("timestamp without time zone", {
      name: "modified_date",
      nullable: true,
    })
    modified_date: Date | null;

    @Column("character varying", { name: "status"})
    status: string | null;

    @Column("bigint", { name: "success_count" })
    success_count: string;

    @Column("bigint", { name: "failure_count" })
    failure_count: string;

    @Column("bigint", { name: "wrapper_fk" })
    wrapper_fk: string;

    @ManyToOne(() => Wrapper, (wrapper) => wrapper.bulkverifications)
    @JoinColumn([{ name: "wrapper_fk", referencedColumnName: "pk" }])
    wrapperFk: Wrapper;

    @Column("bigint", { name: "user_fk" })
    userFk: string;

    @OneToMany(() => Invocations, (invocations) => invocations.bulkFk)
    invocations: Invocations[];
}