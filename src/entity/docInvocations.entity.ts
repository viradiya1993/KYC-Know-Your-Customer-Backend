import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Invocations } from "./invocations.entity";

@Index("doc_invocations_pkey", ["pk"], { unique: true })
@Entity("doc_invocations", { schema: "public" })
export class DocInvocations {
  @Column("character varying", {
    name: "candidate_report_id",
    nullable: true,
    length: 255,
  })
  candidateReportId: string | null;

  @Column("character varying", { name: "dob", nullable: true, length: 255 })
  dob: string | null;

  @Column("character varying", { name: "doc_type", length: 255 })
  docType: string;

  @Column("character varying", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("character varying", {
    name: "firstname",
    nullable: true,
    length: 255,
  })
  firstname: string | null;

  @Column("character varying", { name: "mobile", nullable: true, length: 255 })
  mobile: string | null;

  @Column("character varying", {
    name: "report_id",
    nullable: true,
    length: 255,
  })
  reportId: string | null;

  @Column("character varying", { name: "surname", nullable: true, length: 255 })
  surname: string | null;

  @Column("boolean", { name: "verified", nullable: true })
  verified: boolean | null;

  @Column("bigint", { primary: true, name: "pk" })
  pk: string;

  @OneToOne(() => Invocations, (invocations) => invocations.docInvocations)
  @JoinColumn([{ name: "pk", referencedColumnName: "pk" }])
  pk2: Invocations;
}
