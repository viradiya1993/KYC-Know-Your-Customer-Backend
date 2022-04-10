import { Column, Entity, Index } from "typeorm";

@Index("admin_pkey", ["pk"], { unique: true })
@Entity("admin", { schema: "public" })
export class Admin {
  @Column("bigint", { primary: true, name: "pk" })
  pk: string;
}
