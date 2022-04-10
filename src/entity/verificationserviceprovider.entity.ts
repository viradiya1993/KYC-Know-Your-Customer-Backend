import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { WrapperServiceProviders } from "./wrapperServiceProviders.entity";
import { CustomerBands } from './customerBand.entity';

@Index("verification_service_provider_pkey", ["pk"], { unique: true })
@Entity("verification_service_provider", { schema: "public" })
export class VerificationServiceProvider {
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

  @Column("character varying", {
    name: "api_doc_url",
    nullable: true,
    length: 255,
  })
  apiDocUrl: string | null;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 255,
  })
  description: string | null;

  @Column("character varying", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("character varying", { name: "website", nullable: true, length: 255 })
  website: string | null;

  @Column("character varying", { name: "logo", nullable: true, length: 255 })
  logo: string | null;
  
  @OneToMany(
    () => WrapperServiceProviders,
    (wrapperServiceProviders) => wrapperServiceProviders.serviceProviderFk2
  )
  wrapperServiceProviders: WrapperServiceProviders[];
  
  @ManyToOne(() => CustomerBands, (customerBands) => customerBands.verificationServiceProvider)
  @JoinColumn([{ name: "pk", referencedColumnName: "wrapper_service_provider_fk" }])
  cumtomerBrandFk: CustomerBands;

  // @OneToMany(() => WrapperServiceProviders, (wrapperServiceProviders) => wrapperServiceProviders.wrapperServiceProviders)
  // wrapperVerifiedService: WrapperServiceProviders[];
}
