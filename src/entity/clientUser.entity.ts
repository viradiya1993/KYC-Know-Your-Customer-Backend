import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Client } from "./client.entity";
import { User } from "./user.entity";

@Index("client_user_pkey", ["pk"], { unique: true })
@Entity("client_user", { schema: "public" })
export class ClientUser {
  @Column("bigint", { primary: true, name: "pk" })
  pk: string;

  @ManyToOne(() => Client, (client) => client.clientUsers)
  @JoinColumn([{ name: "client_fk", referencedColumnName: "pk" }])
  clientFk: Client;

  @ManyToOne(() => User, (user) => user.clientUsers)
  @JoinColumn([{ name: "pk", referencedColumnName: "pk" }])
  clientUserFk: User;

  @OneToMany(() => Client, (client) => client.clientUserFk)
  client: ClientUser[];
}
