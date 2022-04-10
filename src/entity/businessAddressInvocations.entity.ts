import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Invocations } from "./invocations.entity";

@Index("business_address_invocations_pkey", ["pk"], { unique: true })
@Entity("business_address_invocations", { schema: "public" })
export class BusinessAddressInvocations {
  @Column("character varying", { name: "city", length: 255 })
  city: string;

  @Column("character varying", { name: "country", length: 255 })
  country: string;

  @Column("character varying", { name: "email", length: 255 })
  email: string;

  @Column("character varying", { name: "landmark", length: 255 })
  landmark: string;

  @Column("character varying", { name: "mobile", length: 255 })
  mobile: string;

  @Column("character varying", { name: "state", length: 255 })
  state: string;

  @Column("character varying", { name: "street", length: 255 })
  street: string;

  @Column("boolean", { name: "verified", nullable: true })
  verified: boolean | null;

  @Column("bigint", { primary: true, name: "pk" })
  pk: string;

  @Column("character varying", { name: "building_number", length: 255 })
  buildingNumber: string;

  @Column("character varying", { name: "business_name", length: 255 })
  businessName: string;

  @Column("character varying", { name: "date_of_incorporation", length: 255 })
  dateOfIncorporation: string;

  @Column("character varying", { name: "registration_number", length: 255 })
  registrationNumber: string;

  @OneToOne(
    () => Invocations,
    (invocations) => invocations.businessAddressInvocations
  )
  @JoinColumn([{ name: "pk", referencedColumnName: "pk" }])
  pk2: Invocations;
}
