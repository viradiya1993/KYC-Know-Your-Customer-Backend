import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Invocations } from "./invocations.entity";

@Index("bvn_invocations_pkey", ["pk"], { unique: true })
@Entity("bvn_invocations", { schema: "public" })
export class BvnInvocations {
  @Column("character varying", { name: "bvn", length: 255 })
  bvn: string;

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

  @Column("bigint", { primary: true, name: "pk" })
  pk: string;

  @Column("boolean", { name: "verified", nullable: true })
  verified: boolean | null;

  @Column("character varying", {
    name: "date_of_birth",
    nullable: true,
    length: 255,
  })
  dateOfBirth: string | null;

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

  @Column("character varying", { name: "surname", nullable: true, length: 255 })
  surname: string | null;

  @Column("character varying", { name: "type", nullable: true, length: 255 })
  type: string | null;

  @OneToOne(() => Invocations, (invocations) => invocations.bvnInvocations)
  @JoinColumn([{ name: "pk", referencedColumnName: "pk" }])
  pk2: Invocations;
}
