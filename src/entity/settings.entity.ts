import { Column, Entity, Index } from "typeorm";

@Index("uk_rk5afi9vbc824rvihuax10mrh", ["name"], { unique: true })
@Index("settings_pkey", ["pk"], { unique: true })
@Entity("settings", { schema: "public" })
export class Settings {
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
  createdBy: string;

  @Column("character varying", { name: "description", length: 255 })
  description: string;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("character varying", { name: "settingstype", length: 255 })
  settingstype: string;

  @Column("character varying", { name: "value", length: 1000 })
  value: string;
}
