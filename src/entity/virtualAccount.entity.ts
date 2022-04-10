import { Column, Entity, Index,JoinColumn,ManyToOne,PrimaryGeneratedColumn } from "typeorm";
import { Bank } from "./bank.entity";
import { Wallet } from "./wallet.entity";

@Index("virtual_account_pkey", ["pk"], { unique: true })
@Entity("virtual_account", { schema: "public" })
export class VirtualAccount {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column("character varying", { name: "account_number"})
    account_number: string;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
      })
    dateCreated: Date;

    @Column("boolean", { name: "active" })
    active: boolean;

    @ManyToOne(() => Wallet, (wallet) => wallet.virtualAccount)
    @JoinColumn([{ name: "wallet_fk", referencedColumnName: "pk" }])
    walletFk: Wallet;

    @ManyToOne(() => Bank, (bank) => bank.virtualAccount)
    @JoinColumn([{ name: "bank_fk", referencedColumnName: "pk" }])
    bankFk: Wallet;
}
