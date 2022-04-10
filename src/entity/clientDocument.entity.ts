import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Client } from "./client.entity";

@Index("uk_75hl87p4n8uosjt9vi0v22ybs", ["fileName"], { unique: true })
@Index("uk_ef63s70l6ms7tncjl7jtui832", ["path"], { unique: true })
@Index("client_document_pkey", ["pk"], { unique: true })
@Entity("client_document", { schema: "public" })
export class ClientDocument {
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

  @Column("character varying", { name: "file_name", unique: true, length: 255 })
  fileName: string;

  @Column("character varying", { name: "label", length: 255 })
  label: string;

  @Column("character varying", {
    name: "labelvalue",
    nullable: true,
    length: 255,
  })
  labelvalue: string | null;

  @Column("character varying", { name: "path", unique: true, length: 255 })
  path: string;

  @Column("timestamp without time zone", { name: "timestamp" })
  timestamp: Date;

  @ManyToOne(() => Client, (client) => client.clientDocuments)
  @JoinColumn([{ name: "client_fk", referencedColumnName: "pk" }])
  clientFk: Client;
}
