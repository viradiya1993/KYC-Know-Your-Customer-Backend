import { Column, Entity, Index,JoinColumn,ManyToOne,PrimaryGeneratedColumn,OneToMany } from "typeorm";
import { Client } from "./client.entity";
import { VirtualAccount } from "./virtualAccount.entity";

@Index("wallet_pkey", ["pk"], { unique: true })
@Entity("wallet", { schema: "public" })
export class Wallet {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
      })
    dateCreated: Date;

    @Column("timestamp without time zone", {
        name: "last_modified",
        nullable: true,
      })
    dateModified: Date;

    @Column("boolean", { name: "active" })
    active: boolean;

    @Column("character varying", { name: "wallet_id"})
    wallet_id: string;

    @Column("numeric", {
        name: "last_known_balance",
        nullable: true,
        precision: 19,
        scale: 2,
    })
    last_known_balance: string | null;

    @Column("boolean", { name: "primary" })
    primary: boolean;

    @ManyToOne(() => Client, (client) => client.wallet)
    @JoinColumn([{ name: "client_fk", referencedColumnName: "pk" }])
    clientFk: Client;

    @OneToMany(() => VirtualAccount, (virtualAccount) => virtualAccount.walletFk)
    virtualAccount: VirtualAccount[];
}
