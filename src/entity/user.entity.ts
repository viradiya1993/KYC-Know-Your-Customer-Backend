import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { ClientUser } from "./clientUser.entity";
import { Invocations } from "./invocations.entity";

import { Languagepack } from './languagepack.entity'
import { UserType } from './userType.entity'

@Entity("user", { schema: "public" })
export class User {
  @PrimaryGeneratedColumn()
  pk: number;

  @Column("character varying", { name: "type" })
  type: string;

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

  @Column("boolean", { name: "is_deactivated" })
  is_deactivated: boolean;

  @Column("character varying", { name: "email" })
  email: string;

  @Column("character varying", { name: "firstname" })
  firstName: string;

  @Column("timestamp without time zone", {
    name: "lastlogin",
    nullable: true,
  })
  lastlogin: Date | null;
  
  @Column("character varying", { name: "passport_path" })
  passport_path: string  | null;

  @Column("character varying", { name: "password" })
  password: string  | null;

  @Column("character varying", { name: "phoneno" })
  phoneno: string;

  @Column("boolean", { name: "reset_passsword_on_login" })
  reset_password_on_login: boolean;

  @Column("character varying", { name: "surname" })
  surname: string;

  @Column("character varying", { name: "userid", unique: true })
  userid: string;

  @Column("character varying", { name: "base_user_id", unique: true, default: null })
  base_user_id: string;
  
  @Column("bigint", { name: "lang_pack_fk" })
  lang_pack_fk: number;

  @Column("bigint", { name: "type_fk" })
  type_fk: bigint;

  @Column("boolean", { name: "owner" })
  owner: boolean;

  @Column("boolean", { name: "email_consent" })
  email_consent: boolean;

  @Column("boolean", { name: "promotion_consent" })
  promotion_consent: boolean;

  @Column("timestamp without time zone", {
    name: "email_consent_date",
    nullable: true,
  })
  email_consent_date: Date | null;

  @Column("timestamp without time zone", {
    name: "promotion_consent_date",
    nullable: true,
  })
  promotion_consent_date: Date | null;

  @Column("boolean", { name: "is_dismissed_tour" })
  is_dismissed_tour: boolean;

  @OneToMany(() => Languagepack, (languagepack) => languagepack.langPk)
  languagepack: Languagepack[];

  @OneToMany(() => UserType, (userType) => userType.typePk)
  userType: UserType[];

  @OneToMany(() => ClientUser, (clientUser) => clientUser.clientUserFk)
  clientUsers: ClientUser[];

  @OneToMany(() => Invocations, (invocations) => invocations.userFk)
  invocations: Invocations[];
}
