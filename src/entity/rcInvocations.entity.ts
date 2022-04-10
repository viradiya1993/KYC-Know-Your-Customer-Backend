import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Invocations } from "./invocations.entity";

@Index("rc_invocations_pkey", ["pk"], { unique: true })
@Entity("rc_invocations", { schema: "public" })
export class RcInvocations {
  @Column("character varying", {
    name: "business_address",
    nullable: true,
    length: 255,
  })
  businessAddress: string | null;

  @Column("character varying", { name: "company_name", length: 255 })
  companyName: string;

  @Column("character varying", {
    name: "date_of_incorporation",
    nullable: true,
    length: 255,
  })
  dateOfIncorporation: string | null;

  @Column("character varying", { name: "rc_number", length: 255 })
  rcNumber: string;

  @Column("character varying", {
    name: "service_provider",
    nullable: true,
    length: 255,
  })
  serviceProvider: string | null;

  @Column("boolean", { name: "verified", nullable: true })
  verified: boolean | null;

  @Column("bigint", { primary: true, name: "pk" })
  pk: string;

  @OneToOne(() => Invocations, (invocations) => invocations.rcInvocations)
  @JoinColumn([{ name: "pk", referencedColumnName: "pk" }])
  pk2: Invocations;
}
