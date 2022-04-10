import { Column, Entity, Index } from "typeorm";

@Index("UQ_fe0bb3f6520ee0469504521e710", ["username"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "username", unique: true })
  username: string;

  @Column("character varying", { name: "password" })
  password: string;

  @Column("character varying", { name: "email" })
  email: string;

  @Column("timestamp without time zone", {
    name: "createdOn",
    default: () => "now()",
  })
  createdOn: Date;

  @Column("timestamp without time zone", {
    name: "updatedOn",
    default: () => "now()",
  })
  updatedOn: Date;
}
