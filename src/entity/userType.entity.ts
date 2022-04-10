import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { Privilege } from "./privilege.entity";
import { User } from "./user.entity";

@Index("uk_87dbyjqw85q2ey5hgsb0o5ykr", ["name"], { unique: true })
@Index("user_type_pkey", ["pk"], { unique: true })
@Entity("user_type", { schema: "public" })
export class UserType {
  @Column("bigint", { primary: true, name: "pk" })
  pk: bigint;

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

  @Column("character varying", { name: "path", nullable: true, length: 255 })
  path: string | null;

  @Column("character varying", { name: "usertype_code"})
  usertype_code: string;

  @ManyToMany(() => Privilege, (privilege) => privilege.userTypes)
  privileges: Privilege[];

  @ManyToOne(() => User, (user) => user.userType)
  @JoinColumn([{ name: "pk", referencedColumnName: "type_fk" }])
  typePk: User;
}
