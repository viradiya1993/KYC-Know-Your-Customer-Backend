import { Column, Entity, Index, JoinColumn, ManyToOne,PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client.entity";
import { Wrapper } from "./wrapper.entity";

@Index("uk_7xxeuh8rl09xrphae7mg9obmd", ["key"], { unique: true })
@Index("clientkeys_pkey", ["pk"], { unique: true })
@Entity("clientkeys", { schema: "public" })
export class Clientkeys {
  @PrimaryGeneratedColumn()
  pk: number;

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

  @Column("timestamp without time zone", {
    name: "last_invocation",
    nullable: true,
  })
  lastInvocation: Date | null;

  @Column("boolean", { name: "deleted" })
  deleted: boolean;

  @Column("bigint", { name: "created_by" })
  createdBy: number;

  @Column("numeric", { name: "failure_charge", precision: 19, scale: 2 })
  failureCharge: string;

  @Column("character varying", {
    name: "_instance",
    nullable: true,
    length: 255,
  })
  instance: string | null;

  @Column("character varying", { name: "key", unique: true, length: 255 })
  key: string;

  @Column("boolean", { name: "is_live" })
  isLive: boolean;

  @Column("numeric", {
    name: "negotiated",
    nullable: true,
    precision: 19,
    scale: 2,
  })
  negotiated: string | null;

  @Column("numeric", { name: "success_charge", precision: 19, scale: 2 })
  successCharge: string;

  @Column("bigint", { name: "service_provider", nullable: true })
  serviceProvider: string | null;

  @Column("bigint", { name: "client_fk" })
  Client_FK1: number;

  @Column("bigint", { name: "wrapper_fk" })
  Wrapper_FK1: number;

  @Column("boolean", { name: "custom_band_enabled", default: false  })
  customBandEnabled: boolean;

  @ManyToOne(() => Client, (client) => client.clientkeys)
  @JoinColumn([{ name: "client_fk", referencedColumnName: "pk" }])
  clientFk: Client;

  @ManyToOne(() => Wrapper, (wrapper) => wrapper.clientkeys)
  @JoinColumn([{ name: "wrapper_fk", referencedColumnName: "pk" }])
  wrapperFk: Wrapper;
}
