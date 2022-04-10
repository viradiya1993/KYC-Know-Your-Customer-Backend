import { Column, Entity, Index, JoinColumn, ManyToOne ,OneToMany,OneToOne} from "typeorm";
import { Wrapper } from "./wrapper.entity";

@Index("id", ["id"], { unique: true })
@Entity("wrapper_details", { schema: "public" })
export class WrapperDetails {
    @Column("bigint", { primary: true, name: "id" })
    id: string;

    @Column("timestamp without time zone", {
        name: "date_created",
        nullable: true,
    })
    date_created: Date | null;

    @Column("boolean", { name: "active" })
    active: boolean;
    
    @Column("character varying", { name: "live_mode_endpoint"})
    live_mode_endpoint: string | null;

    @Column("character varying", { name: "test_mode_endpoint"})
    test_mode_endpoint: string | null;

    @Column("json", { name: "form_json"})
    form_json: string | null;

    @Column("bigint", { name: "wrapper_fk" })
    wrapper_fk: string;

    @OneToOne(
        () => Wrapper,
        (wrapper) => wrapper.wrapperDetails
      )
      @JoinColumn([{ name: "wrapper_fk", referencedColumnName: "pk" }])
      wrapperfk: Wrapper;

}