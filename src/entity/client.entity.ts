import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClientDocument } from "./clientDocument.entity";
import { ClientProfile } from "./clientProfile.entity";
import { ClientUser } from "./clientUser.entity";
import { Clientkeys } from "./clientkeys.entity";
import { CustomerBands } from './customerBand.entity';
import { Wallet } from "./wallet.entity";

@Index("client_pkey", ["pk"], { unique: true })
@Entity("client", { schema: "public" })
export class Client {
  @PrimaryGeneratedColumn()
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
  createdBy: number;

  @Column("character varying", {
    name: "activation_status",
    nullable: true,
    length: 255,
  })
  activationStatus: string | null;

  @Column("timestamp without time zone", {
    name: "date_activated",
    nullable: true,
  })
  dateActivated: Date | null;

  @Column("boolean", { name: "deactivated" })
  deactivated: boolean;

  @Column("character varying", { name: "logo", nullable: true, length: 255 })
  logo: string | null;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("boolean", { name: "processed" })
  processed: boolean;

  @Column("character varying", { name: "organizationbaseid", unique: true, default: null })
  organizationbaseid: string;

  @Column("integer", { name: "free_rc_verification_count" })
  freeRcVerificationCount: number;

  @Column("boolean", { name: "free_rc_verification_eligibility" })
  freeRcVerificationEligibility: boolean;

  @ManyToOne(() => ClientUser, (clientuser) => clientuser.client)
  @JoinColumn([{ name: "pk", referencedColumnName: "clientFk" }])
  clientUserFk: ClientUser;

  @OneToMany(() => ClientDocument, (clientDocument) => clientDocument.clientFk)
  clientDocuments: ClientDocument[];

  @OneToOne(() => ClientProfile, (clientProfile) => clientProfile.clientPk2)
  clientProfile: ClientProfile;

  @OneToMany(() => ClientUser, (clientUser) => clientUser.clientFk)
  clientUsers: ClientUser[];

  @OneToMany(() => Clientkeys, (clientkeys) => clientkeys.clientFk)
  clientkeys: Clientkeys[];

  @OneToMany(() => CustomerBands, (customerBands) => customerBands.clientFk)
  customerBands: CustomerBands[];

  @OneToMany(() => Wallet, (wallet) => wallet.clientFk)
  wallet: Wallet[];
}
