import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Invocations } from "./invocations.entity";

@Index("id_invocations_pkey", ["pk"], { unique: true })
@Entity("id_invocations", { schema: "public" })
export class IdInvocations {
  @Column("character varying", {
    name: "candidate_report_id",
    nullable: true,
    length: 255,
  })
  candidateReportId: string | null;

  @Column("character varying", { name: "dob", length: 255 })
  dob: string;

  @Column("character varying", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("double precision", {
    name: "face_match_score",
    nullable: true,
    precision: 53,
  })
  faceMatchScore: number | null;

  @Column("character varying", {
    name: "face_match_status",
    nullable: true,
    length: 255,
  })
  faceMatchStatus: string | null;

  @Column("character varying", { name: "firstname", length: 255 })
  firstname: string;

  @Column("character varying", { name: "id_number", length: 255 })
  idNumber: string;

  @Column("character varying", { name: "id_type", length: 255 })
  idType: string;

  @Column("character varying", { name: "mobile", nullable: true, length: 255 })
  mobile: string | null;

  @Column("character varying", {
    name: "report_id",
    nullable: true,
    length: 255,
  })
  reportId: string | null;

  @Column("character varying", { name: "surname", length: 255 })
  surname: string;

  @Column("boolean", { name: "verified", nullable: true })
  verified: boolean | null;

  @Column("bigint", { primary: true, name: "pk" })
  pk: string;

  @OneToOne(() => Invocations, (invocations) => invocations.idInvocations)
  @JoinColumn([{ name: "pk", referencedColumnName: "pk" }])
  pk2: Invocations;
}
