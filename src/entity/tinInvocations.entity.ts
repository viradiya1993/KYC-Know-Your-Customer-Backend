import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Invocations } from "./invocations.entity";

@Index("tin_invocations_pkey", ["pk"], { unique: true })
@Entity("tin_invocations", { schema: "public" })
export class TinInvocations {
  @Column("character varying", {
    name: "company_name",
    nullable: true,
    length: 255,
  })
  companyName: string | null;

  @Column("character varying", {
    name: "service_provider",
    nullable: true,
    length: 255,
  })
  serviceProvider: string | null;

  @Column("character varying", { name: "tin", length: 255 })
  tin: string;

  @Column("boolean", { name: "verified", nullable: true })
  verified: boolean | null;

  @Column("bigint", { primary: true, name: "pk" })
  pk: string;

  @OneToOne(() => Invocations, (invocations) => invocations.tinInvocations)
  @JoinColumn([{ name: "pk", referencedColumnName: "pk" }])
  pk2: Invocations;
}
