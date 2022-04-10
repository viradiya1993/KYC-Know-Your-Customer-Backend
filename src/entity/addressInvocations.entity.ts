import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Invocations } from "./invocations.entity";

@Index("address_invocations_pkey", ["pk"], { unique: true })
@Entity("address_invocations", { schema: "public" })
export class AddressInvocations {
  @Column("character varying", { name: "city", length: 255 })
  city: string;

  @Column("character varying", { name: "country", length: 255 })
  country: string;

  @Column("character varying", { name: "dob", length: 255 })
  dob: string;

  @Column("character varying", { name: "email", length: 255 })
  email: string;

  @Column("character varying", { name: "firstname", length: 255 })
  firstname: string;

  @Column("character varying", { name: "mobile", length: 255 })
  mobile: string;

  @Column("character varying", { name: "state", length: 255 })
  state: string;

  @Column("character varying", { name: "street", length: 255 })
  street: string;

  @Column("character varying", { name: "surname", length: 255 })
  surname: string;

  @Column("boolean", { name: "verified", nullable: true })
  verified: boolean | null;

  @Column("bigint", { primary: true, name: "pk" })
  pk: string;

  @Column("character varying", { name: "building_number", length: 255 })
  buildingNumber: string;

  @OneToOne(() => Invocations, (invocations) => invocations.addressInvocations)
  @JoinColumn([{ name: "pk", referencedColumnName: "pk" }])
  pk2: Invocations;
}
