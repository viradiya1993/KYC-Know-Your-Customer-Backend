import { Injectable } from '@nestjs/common';
import { AdminBillingDto } from './dto/adminBilling.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, getConnectionManager } from 'typeorm';
import { Client } from '../entity/client.entity';
import { Invocations } from '../entity/invocations.entity';
import { Wrapper } from '../entity/wrapper.entity';
import { User } from '../entity/user.entity';
import { Band } from '../entity/band.entity';
import { BandDetailsDto } from './dto/bandDetails.dto';
import { saveBandDetailsDto } from './dto/saveBandDetails.dto';
import { CustomerBands } from '../entity/customerBand.entity';

@Injectable()
export class AdminBillingService {
    constructor(
        @InjectRepository(Invocations)
        private readonly invocationRepository: Repository<Invocations>,
    ) { }

    //THIS WILL FETCH ALL THE ACTIVE CUSTOMERS.
    async getCustomerDetails() {
        const customerData = await getRepository(Client)
            .createQueryBuilder("client")
            .where("client.deactivated = 'false'")
            .select(["client.pk", "client.name"])
            .getMany()

        return customerData;
    }

    //THIS WILL FETCH ALL THE BAND AND CUSTOMER DETAILS.
    async getBandAndCustomerDetails(data: BandDetailsDto) {
        //TO GET THE CUSTOMER DETAILS
        const customerDetails = await getRepository(Client)
            .createQueryBuilder("client")
            .where("client.deactivated = 'false'" )
            .select(["client.pk","client.name"])
            .getMany()

        //TO GET THE BAND DETAILS
        const bandDetails = await getRepository(Band)
            .createQueryBuilder("band")
            .innerJoin("band.wrapperVerificationProviderFK","wrapperServiceProviders","wrapperServiceProviders.pk = band.wrapperVerificationProviderFK")
            .where("band.custom = false" )
            .andWhere("wrapperServiceProviders.active = true")
            .andWhere("wrapperServiceProviders.wrapper_fk = " + data.wrapperid)
            .select(["band.pk as band_pk","CONCAT(band.band_name, ' - ' ,band.minimum_units, ' - ', band.maximum_units) as band_name","band._order as band_order","band.band_price as band_price","band.refund_amount as band_refund_amount","band.wrapper_service_provider_fk as wrapper_service_provider_fk"])
            .getRawMany()

        return {customerDetails , bandDetails};
    }

    //THIS WILL FETCH ALL THE BAND AND CUSTOMER DETAILS.
    async saveBandDetails(data: saveBandDetailsDto) {
        const connection = getConnectionManager().get();
        let bandDetails;
        //CHECK IF CUSTOMER BAND ALREADY EXIST FOR PARTICULAR BAND AND CLIENT.
        const isExist = await getRepository(CustomerBands)
        .createQueryBuilder("CustomerBands")
        .where("CustomerBands.client_fk = " + data.client_pk)
        .andWhere("CustomerBands.band_fk = " + data.band_pk)
        .getCount()

        //IF CUSTOMER BAND ALREADY EXIST THEN WE WILL UPDATE IT OTHER WISE INSERT A NEW RECORD.
        if(isExist > 0)
        {
            await connection.getRepository(CustomerBands).update({ client_fk : data.client_pk , band_fk : data.band_pk },{
                wrapper_service_provider_fk : data.wrapper_service_provider_fk,
                band_order : data.band_order
            });
        }
        else
        {
            await connection.getRepository(CustomerBands).insert({
                wrapper_service_provider_fk : data.wrapper_service_provider_fk,
                client_fk : data.client_pk,
                band_fk : data.band_pk,
                band_order : data.band_order,
                current_band : true
            });
        }
        
        let bandData = await connection.getRepository(CustomerBands).findOne({ client_fk : data.client_pk , band_fk : data.band_pk });
        return bandData;
    }
}
