import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { User } from "./user.entity";

@Index("uk_bhsk03y6thsomjo7eve40kauo", ["code"], { unique: true })
@Index("languagepack_pkey", ["pk"], { unique: true })
@Entity("languagepack", { schema: "public" })
export class Languagepack {
  @Column("bigint", { primary: true, name: "pk" })
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

  @Column("boolean", { name: "deleted" })
  deleted: boolean;

  @Column("bigint", { name: "created_by" })
  createdBy: string;

  @Column("character varying", { name: "code", unique: true, length: 255 })
  code: string;

  @Column("character varying", { name: "language", length: 255 })
  language: string;

  @Column("character varying", { name: "templatepath", length: 255 })
  templatepath: string;

  @ManyToOne(() => User, (user) => user.languagepack)
  @JoinColumn([{ name: "pk", referencedColumnName: "lang_pack_fk" }])
  langPk: User;
}
