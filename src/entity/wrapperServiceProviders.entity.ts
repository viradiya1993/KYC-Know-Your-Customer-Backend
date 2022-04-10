import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VerificationServiceProvider } from "./verificationserviceprovider.entity";
import { Wrapper } from "./wrapper.entity";
import { Band } from "./band.entity";
import { CustomerBands } from "./customerBand.entity";


@Index("wrapper_service_providers_pkey", ["serviceProviderFk", "wrapperFk"], {
  unique: true,
})
@Entity("wrapper_service_providers", { schema: "public" })
export class WrapperServiceProviders {
  @Column("bigint", { primary: true, name: "wrapper_fk" })
  wrapperFk: string;

  @Column("bigint", { primary: true, name: "service_provider_fk" })
  serviceProviderFk: string;

  @Column("character varying", { name: "provider_endpoint" })
  provider_endpoint: string;

  @Column("boolean", { name: "active" })
  active: boolean;

  @Column("numeric", { name: "cost_price" })
  cost_price: number;

  @Column("character varying", { name: "logo" })
  logo: string;

  @PrimaryGeneratedColumn()
  pk: number;

  @Column("character varying", { name: "provider_token" })
  provider_token: string;

  @Column("character varying", { name: "provider_sandbox_endpoint" })
  provider_sandbox_endpoint: string;

  @Column("character varying", { name: "provider_sandbox_token" })
  provider_sandbox_token: string;

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

  @ManyToOne(
    () => VerificationServiceProvider,
    (verificationServiceProvider) =>
      verificationServiceProvider.wrapperServiceProviders
  )
  @JoinColumn([{ name: "service_provider_fk", referencedColumnName: "pk" }])
  serviceProviderFk2: VerificationServiceProvider;

  @ManyToOne(
    () => VerificationServiceProvider,
    (verificationserviceprovider) =>
      verificationserviceprovider.wrapperServiceProviders
  )
  @JoinColumn([{ name: "service_provider_fk", referencedColumnName: "pk" }])
  serviceProviderFk3: VerificationServiceProvider;

  @ManyToOne(() => Wrapper, (wrapper) => wrapper.wrapperServiceProviders)
  @JoinColumn([{ name: "wrapper_fk", referencedColumnName: "pk" }])
  wrapperFk2: Wrapper;

  @OneToMany(() => Band, (band) => band.wrapperVerificationProviderFK)
  wrapperVerificationProviderFK: Band[];

  @OneToMany(() => CustomerBands, (customerBands) => customerBands.wrapperVerificationProviderFK)
  wrapperVerificationProviderFK2: CustomerBands[];
}


