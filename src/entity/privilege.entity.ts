import { Column, Entity, Index, JoinTable, ManyToMany } from "typeorm";
import { UserType } from "./userType.entity";

@Index("uk_tcjtkyhbxekm2p1hsv6ju9bju", ["name"], { unique: true })
@Index("privilege_pkey", ["pk"], { unique: true })
@Entity("privilege", { schema: "public" })
export class Privilege {
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

  @ManyToMany(() => UserType, (userType) => userType.privileges)
  @JoinTable({
    name: "usertype_privileges",
    joinColumns: [{ name: "privilege_fk", referencedColumnName: "pk" }],
    inverseJoinColumns: [{ name: "user_type_fk", referencedColumnName: "pk" }],
    schema: "public",
  })
  userTypes: UserType[];
}
