import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
  } from "typeorm";

  import { Client } from "./client.entity";
  import { VerificationServiceProvider } from './verificationserviceprovider.entity';
  import { Band } from './band.entity';
import { WrapperServiceProviders } from "./wrapperServiceProviders.entity";

  @Index("customer_bands_pkey", ["pk"], { unique: true })
  @Entity("customer_bands", { schema: "public" })
  export class CustomerBands {
    @PrimaryGeneratedColumn()
    pk: number;
  
    @Column("bigint", { name: "wrapper_service_provider_fk", nullable: true })
    wrapper_service_provider_fk: string;
  
    @Column("bigint", { name: "client_fk", nullable: true })
    client_fk: bigint;

    @Column("bigint", { name: "band_fk", nullable: true })
    band_fk: bigint;

    @Column("bigint", { name: "band_order" })
    band_order: bigint;

    @Column("boolean", { name: "current_band" })
    current_band: boolean;

    @OneToMany(() => VerificationServiceProvider, (verificationServiceProvider) => verificationServiceProvider.cumtomerBrandFk)
    verificationServiceProvider: VerificationServiceProvider[];

    @ManyToOne(() => Client, (client) => client.customerBands)
    @JoinColumn([{ name: "client_fk", referencedColumnName: "pk" }])
    clientFk: Client;

    @OneToMany(() => Band, (band) => band.cumtomerBrandFk)
    band: Band[];

    @ManyToOne(() => WrapperServiceProviders, (wrapperServiceProviders) => wrapperServiceProviders.wrapperVerificationProviderFK2)
    @JoinColumn([{ name: "wrapper_service_provider_fk", referencedColumnName: "pk" }])
    wrapperVerificationProviderFK: WrapperServiceProviders;

  }
  