import { Column, Entity, Index } from "typeorm";

@Index("gdpr_compliance_log_pkey", ["pk"], { unique: true })
@Entity("gdpr_compliance_log", { schema: "public" })
export class GdprComplianceLog {
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

  @Column("character varying", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("character varying", {
    name: "ip_address",
    nullable: true,
    length: 255,
  })
  ipAddress: string | null;
}
