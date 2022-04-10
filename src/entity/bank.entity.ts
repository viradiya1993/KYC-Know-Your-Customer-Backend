import { Column, Entity, Index,PrimaryGeneratedColumn,OneToMany } from "typeorm";
import { VirtualAccount } from "./virtualAccount.entity";

@Index("bank_pkey", ["pk"], { unique: true })
@Entity("bank", { schema: "public" })
export class Bank {
    @PrimaryGeneratedColumn()
    pk: number;

    @Column("character varying", { name: "name" })
    name: string | null;

    @Column("character varying", { name: "code"})
    code: string | null;

    @Column("boolean", { name: "active" })
    active: boolean;

    @OneToMany(() => VirtualAccount, (virtualAccount) => virtualAccount.bankFk)
    virtualAccount: VirtualAccount[];
}
