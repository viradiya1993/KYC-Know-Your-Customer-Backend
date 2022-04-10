import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Invocations } from "./invocations.entity";

@Index("acc_inquiry_invocations_pkey", ["pk"], { unique: true })
@Entity("acc_inquiry_invocations", { schema: "public" })
export class AccInquiryInvocations {
  @Column("character varying", {
    name: "account_number",
    nullable: true,
    length: 255,
  })
  accountNumber: string | null;

  @Column("character varying", {
    name: "bank_code",
    nullable: true,
    length: 255,
  })
  bankCode: string | null;

  @Column("character varying", { name: "bvn", length: 255 })
  bvn: string;

  @Column("character varying", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("character varying", {
    name: "other_names",
    nullable: true,
    length: 255,
  })
  otherNames: string | null;

  @Column("character varying", { name: "surname", nullable: true, length: 255 })
  surname: string | null;

  @Column("bigint", { primary: true, name: "pk" })
  pk: string;

  @OneToOne(
    () => Invocations,
    (invocations) => invocations.accInquiryInvocations
  )
  @JoinColumn([{ name: "pk", referencedColumnName: "pk" }])
  pk2: Invocations;
}
