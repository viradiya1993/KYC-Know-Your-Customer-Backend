import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Invocations } from "./invocations.entity";

@Index("facematch_invocations_pkey", ["pk"], { unique: true })
@Entity("facematch_invocations", { schema: "public" })
export class FacematchInvocations {
  @Column("character varying", {
    name: "face_match_provider",
    nullable: true,
    length: 255,
  })
  faceMatchProvider: string | null;

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

  @OneToOne(
    () => Invocations,
    (invocations) => invocations.facematchInvocations
  )
  @JoinColumn([{ name: "pk", referencedColumnName: "pk" }])
  pk2: Invocations;
}
