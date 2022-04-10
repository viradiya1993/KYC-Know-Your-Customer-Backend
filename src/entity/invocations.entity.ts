import { Column, Entity, Index, OneToOne,ManyToOne,JoinColumn,PrimaryGeneratedColumn } from "typeorm";
import { AccInquiryInvocations } from "./accInquiryInvocations.entity";
import { AddressInvocations } from "./addressInvocations.entity";
import { BusinessAddressInvocations } from "./businessAddressInvocations.entity";
import { BvnInvocations } from "./bvnInvocations.entity";
import { DocInvocations } from "./docInvocations.entity";
import { FacematchInvocations } from "./facematchInvocations.entity";
import { IdInvocations } from "./idInvocations.entity";
import { RcInvocations } from "./rcInvocations.entity";
import { TinInvocations } from "./tinInvocations.entity";
import { Wrapper } from "./wrapper.entity";
import { BulkVerifications } from "./bulkverifications.entity";
import { User } from "./user.entity";

@Index("invocations_pkey", ["pk"], { unique: true })
@Index("invocations_uk_ic6s10r7tvnnknnt805gv0oc7", ["transactionRef"], {
  unique: true,
})
@Entity("invocations", { schema: "public" })
export class Invocations {
  @Column("character varying", { name: "type", length: 31 })
  type: string;

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

  @Column("character varying", {
    name: "processing_error",
    nullable: true,
    length: 255,
  })
  processingError: string | null;

  @Column("character varying", { name: "api_key", length: 255 })
  apiKey: string;

  @Column("character varying", { name: "status", nullable: true, length: 512 })
  status: string | null;

  @Column("timestamp without time zone", { name: "invocation_time" })
  invocationTime: Date;

  @Column("character varying", { name: "transaction_ref", length: 255 })
  transactionRef: string;

  @Column("character varying", {
    name: "failure_reason",
    nullable: true,
    length: 255,
  })
  failureReason: string | null;

  @Column("character varying", {
    name: "provider_invocation_id",
    nullable: true,
    length: 255,
  })
  providerInvocationId: string | null;

  @Column("character varying", {
    name: "service_provider",
    nullable: true,
    length: 255,
  })
  serviceProvider: string | null;

  @Column("numeric", { name: "created_by", nullable: true })
  createdBy: string | null;

  @Column("numeric", {
    name: "amount",
    nullable: true,
    precision: 19,
    scale: 2,
  })
  amount: string | null;

  @Column("numeric", {
    name: "refund_amount",
    nullable: true,
    precision: 19,
    scale: 2,
  })
  refundAmount: string | null;

  @Column("character varying", {
    name: "transaction_status",
    nullable: true,
    length: 255,
  })
  transactionStatus: string | null;

  @Column("character varying", { name: "transaction_type"})
  transaction_type: string;

  @Column("timestamp without time zone", { name: "response_time" })
  response_time: Date;

  @Column("bigint",{ name: "wrapper_fk"})
  wrapper_fk: number;

  @Column("bigint",{ name: "user_fk"})
  user_fk: number;

  @Column("bigint", { name: "bulk_fk"})
  bulk_fk: bigint;

  @Column("character varying", {
    name: "wrapper_name"
  })
  wrapper_name: string ;

  @Column("character varying", {
    name: "userid"
  })
  userid: string ;

  @Column("character varying", { name: "_mode"})
  _mode: string;

  @Column("character varying", { name: "verification_status_string", nullable: true })
  verification_status_string: string 

  @ManyToOne(() => Wrapper, (wrapper) => wrapper.invocations)
  @JoinColumn([{ name: "wrapper_fk", referencedColumnName: "pk" }])
  wrapperFk: Wrapper;

  @ManyToOne(() => BulkVerifications, (bulkverifications) => bulkverifications.invocations)
  @JoinColumn([{ name: "bulk_fk", referencedColumnName: "pk" }])
  bulkFk: Wrapper;

  @ManyToOne(() => User, (user) => user.invocations)
  @JoinColumn([{ name: "user_fk", referencedColumnName: "pk" }])
  userFk: User;

  @OneToOne(
    () => AccInquiryInvocations,
    (accInquiryInvocations) => accInquiryInvocations.pk2
  )
  accInquiryInvocations: AccInquiryInvocations;

  @OneToOne(
    () => AddressInvocations,
    (addressInvocations) => addressInvocations.pk2
  )
  addressInvocations: AddressInvocations;

  @OneToOne(
    () => BusinessAddressInvocations,
    (businessAddressInvocations) => businessAddressInvocations.pk2
  )
  businessAddressInvocations: BusinessAddressInvocations;

  @OneToOne(() => BvnInvocations, (bvnInvocations) => bvnInvocations.pk2)
  bvnInvocations: BvnInvocations;

  @OneToOne(() => DocInvocations, (docInvocations) => docInvocations.pk2)
  docInvocations: DocInvocations;

  @OneToOne(
    () => FacematchInvocations,
    (facematchInvocations) => facematchInvocations.pk2
  )
  facematchInvocations: FacematchInvocations;

  @OneToOne(() => IdInvocations, (idInvocations) => idInvocations.pk2)
  idInvocations: IdInvocations;

  @OneToOne(() => RcInvocations, (rcInvocations) => rcInvocations.pk2)
  rcInvocations: RcInvocations;

  @OneToOne(() => TinInvocations, (tinInvocations) => tinInvocations.pk2)
  tinInvocations: TinInvocations;
}
