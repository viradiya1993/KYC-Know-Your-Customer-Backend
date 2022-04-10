import {
    Entity,
    Column,
    OneToMany,
    Index,
    JoinTable,
    OneToOne
  } from 'typeorm';
  import { WrapperServiceProviders } from "./wrapperServiceProviders.entity";
  import { Clientkeys } from "./clientkeys.entity";
  import { BulkVerifications } from "./bulkverifications.entity";
  import { Invocations } from "./invocations.entity";
  import { WrapperDetails } from "./wrapperDetails.entity";

@Index("uk_mqb2pgowf7yjxhv7rrtaggs07", ["name"], { unique: true })
@Index("wrapper_pkey", ["pk"], { unique: true })
@Index("uk_7o8xlnfrafd6uj0p876cymclr", ["wrapperRef"], { unique: true })
@Entity("wrapper", { schema: "public" })
export class Wrapper {
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
  
    @Column("numeric", { name: "charge", precision: 19, scale: 2 })
    charge: string;
  
    @Column("character varying", {
      name: "description",
      nullable: true,
      length: 255,
    })
    description: string | null;
  
    @Column("numeric", { name: "failure_base_charge", precision: 19, scale: 2 })
    failureBaseCharge: string;
  
    @Column("timestamp without time zone", {
      name: "last_invocation",
      nullable: true,
    })
    lastInvocation: Date | null;

    @Column("character varying", { name: "name", unique: true, length: 255 })
    name: string;

    @Column("character varying", { name: "type",  length: 31 })
    type: string;
  
    @Column("boolean", { name: "published", nullable: true })
    published: boolean | null;
  
    @Column("numeric", { name: "success_base_charge", precision: 19, scale: 2 })
    successBaseCharge: string;
  
    @Column("character varying", {
      name: "wrapper_ref",
      unique: true,
      length: 255,
    })
    wrapperRef: string;
  
    @Column("character varying", {
      name: "api_doc_url",
      nullable: true,
      length: 255,
    })
    apiDocUrl: string | null;

    @Column("character varying",{name:"bulk_template_link"})
    bulk_template_link: string 

    @Column("boolean", { name: "bulk_enabled" })
    bulk_enabled: boolean;

    @Column("character varying", { name: "verification_type",  length: 31 })
    verification_type: string;

    @Column("character varying", { name: "service_type" })
    service_type: string;

    @Column("character varying", { name: "header_description" })
    header_description: string;

    @Column("boolean", { name: "active" })
    active: boolean;

  @OneToMany(() => Clientkeys, (clientkeys) => clientkeys.wrapperFk)
  clientkeys: Clientkeys[];

  @OneToMany(
    () => WrapperServiceProviders,
    (wrapperServiceProviders) => wrapperServiceProviders.wrapperFk2
  )
  wrapperServiceProviders: WrapperServiceProviders[];

  @OneToMany(() => BulkVerifications, (bulkverifications) => bulkverifications.wrapperFk)
  bulkverifications: BulkVerifications[];

  @OneToMany(() => Invocations, (invocations) => invocations.wrapperFk)
  invocations: Invocations[];

  @OneToOne(() => WrapperDetails, (wrapperDetails) => wrapperDetails.wrapperfk)
  wrapperDetails: WrapperDetails;
}