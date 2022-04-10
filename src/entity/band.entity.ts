import { Wrapper } from "src/graphql.schema";
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
  } from "typeorm";
  import { CustomerBands } from '../entity/customerBand.entity';
import { WrapperServiceProviders } from "../entity/wrapperServiceProviders.entity";

  @Entity("band", { schema: "public" })
  export class Band {
    @PrimaryGeneratedColumn()
    pk: number;
  
    @Column("boolean", { name: "custom" })
    custom: string;
  
    @Column("numeric", { name: "band_price", precision: 19, scale: 2 })
    band_price: number;

    @Column("numeric", { name: "band_name", unique: true })
    band_name: number;

    @Column("numeric", { name: "minimum_units", precision: 19, scale: 2 })
    minimum_units: number;

    @Column("numeric", { name: "maximum_units", precision: 19, scale: 2 })
    maximum_units: number;

    @Column("bigint", { name: "wrapper_service_provider_fk" })
    wrapper_service_provider_fk: bigint;

    @Column("bigint", { name: "_order" })
    _order: bigint;

    @Column("double precision", { name: "refund_amount", precision: 19, scale: 2 })
    refund_amount: number;

    @Column("timestamp without time zone", {
        name: "order_date",
        nullable: true,
      })
      order_date: Date | null;

    @Column("bigint", { name: "created_by" })
    createdBy: number;
  
    @Column("boolean", { name: "active" })
    active: boolean;

    @ManyToOne(() => CustomerBands, (customerBands) => customerBands.band)
    @JoinColumn([{ name: "pk", referencedColumnName: "band_fk" }])
    cumtomerBrandFk: CustomerBands;

    @ManyToOne(() => WrapperServiceProviders, (wrapperServiceProviders) => wrapperServiceProviders.wrapperVerificationProviderFK)
    @JoinColumn([{ name: "wrapper_service_provider_fk", referencedColumnName: "pk" }])
    wrapperVerificationProviderFK: WrapperServiceProviders;
    
  }
  