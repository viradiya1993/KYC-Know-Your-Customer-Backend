import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Client } from "./client.entity";

@Index("uk_6d9yctv8bnmnw09iu0wq9o144", ["clientPk"], { unique: true })
@Index("client_profile_pkey", ["pk"], { unique: true })
@Index("uk_ajxk7fimr2rfed6eaul3poyrt", ["rcnumber"], { unique: true })
@Entity("client_profile", { schema: "public" })
export class ClientProfile {
  @Column("bigint", { primary: true, name: "pk" })
  pk: string;

  @Column("timestamp without time zone", {
    name: "date_created",
    nullable: true,
  })
  dateCreated: Date | null;

  @Column("timestamp without time zone", {
    name: "last_modification",
    nullable: true,
  })
  lastModification: Date | null;

  @Column("boolean", { name: "deleted" })
  deleted: boolean;

  @Column("bigint", { name: "created_by" })
  createdBy: number;

  @Column("character varying", { name: "address", nullable: true, length: 255 })
  address: string | null;

  @Column("character varying", { name: "country", nullable: true, length: 255 })
  country: string | null;

  @Column("character varying", { name: "state", nullable: true, length: 255 })
  state: string | null;

  @Column("character varying", { name: "postalcode", nullable: true, length: 255 })
  postalCode: string | null;

  @Column("character varying", { name: "city", nullable: true, length: 255 })
  city: string | null;

  @Column("character varying", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("character varying", { name: "website", nullable: true, length: 255 })
  website: string | null;

  @Column("boolean", { name: "partner" })
  partner: boolean;

  @Column("character varying", {
    name: "industry",
    nullable: true,
    length: 255,
  })
  industry: string | null;

  @Column("character varying", {
    name: "numberofdirectors",
    nullable: true,
    length: 255,
  })
  numberofdirectors: string | null;

  @Column("character varying", {
    name: "numberofshares",
    nullable: true,
    length: 255,
  })
  numberofshares: string | null;

  @Column("character varying", { name: "phone", nullable: true, length: 255 })
  phone: string | null;

  @Column("character varying", {
    name: "province",
    nullable: true,
    length: 255,
  })
  province: string | null;

  @Column("character varying", { name: "rcnumber", unique: true, length: 255 })
  rcnumber: string;

  @Column("date", { name: "registrationdate", nullable: true })
  registrationdate: string | null;

  @Column("character varying", {
    name: "taxidentificationnumber",
    nullable: true,
    length: 255,
  })
  taxidentificationnumber: string | null;

  @Column("character varying", {
    name: "yearfounded",
    nullable: true,
    length: 255,
  })
  yearfounded: string | null;

  @Column("character varying", { name: "zip", nullable: true, length: 255 })
  zip: string | null;

  @Column("bigint", { name: "client_pk", unique: true })
  clientPk: number;

  @Column("bigint", { name: "yearofregistration" })
  yearOfRegistration: number;

  @OneToOne(() => Client, (client) => client.clientProfile)
  @JoinColumn([{ name: "client_pk", referencedColumnName: "pk" }])
  clientPk2: Client;
}
