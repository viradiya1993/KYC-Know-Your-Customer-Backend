import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, getConnectionManager } from 'typeorm';

import { Invocations } from '../entity/invocations.entity';
import { BillingDto } from '../billing/dto/billing.dto';
import { CustomerBillingDetailsDto } from './dto/customerBillingDetails.dto';
import { CustomerBillingBandDetailsDto } from '../billing/dto/customerBillingBandDetailsDto.dto';
import { User } from '../entity/user.entity';
import { Wrapper } from '../entity/wrapper.entity';
import { Wallet } from '../entity/wallet.entity';
import { Settings } from '../entity/settings.entity';
import { ClientProfile } from '../entity/clientProfile.entity';
import { CustomerBands } from '../entity/customerBand.entity';
import { Client } from '../entity/client.entity';
import { Band } from '../entity/band.entity';
import { Clientkeys } from '../entity/clientkeys.entity';
const axios = require('axios');

@Injectable()
export class BillingService {
    constructor(
        @InjectRepository(Invocations)
        private readonly invocationRepository: Repository<Invocations>,
    ) { }

    // SERVICE TO GET THE LOGEDIN USER DETAILS
    async getLogedInUserDeatils(baseUserId) {
        const qb0 = await getRepository(User)
            .createQueryBuilder("user")
            .innerJoin('user.clientUsers', 'clientUsers', 'user.pk = clientUsers.pk')
            .innerJoin('clientUsers.client', 'client', 'client.pk = clientUsers.clientFk')
            .select(["clientUsers.pk", "clientUsers.clientFk"])
            .where('user.base_user_id =' + `'${baseUserId}'`)

        const userDetails = await qb0.getRawOne();
        return userDetails
    }

    async getBillingCards(data: BillingDto) {
        //THIS WILL FETCH CLIENT DEATILS USING BASE USER ID.
        const clientUser = await this.getLogedInUserDeatils(data.baseuserid)
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // TO GET THE TOTAL REQUEST OF FILTERED BY CLIENT.
        const qb0 = await getRepository(User)
            .createQueryBuilder("user")
            .innerJoin('user.clientUsers', 'clientUsers', 'user.pk = clientUsers.pk')
            .innerJoin('clientUsers.client', 'client', 'client.pk = clientUsers.clientFk')
            .innerJoin('user.invocations', 'invocations', 'user.pk = invocations.user_fk')
            .select(["COUNT(invocations.pk) AS count"])
            .where('user.base_user_id =' + `'${data.baseuserid}'`).orderBy('count', 'DESC')

        // TO GET THE MOST USED SERVICE.
        const qb1 = await getRepository(User)
            .createQueryBuilder("user")
            .innerJoin('user.clientUsers', 'clientUsers', 'user.pk = clientUsers.pk')
            .innerJoin('clientUsers.client', 'client', 'client.pk = clientUsers.clientFk')
            .innerJoin('user.invocations', 'invocations', 'user.pk = invocations.user_fk')
            .innerJoin('invocations.wrapperFk', 'wrapper', 'wrapper.pk = invocations.wrapper_fk')
            .select(["wrapper.name", "COUNT(wrapper.name) AS count"])
            .where('invocations.deleted =' + false)
            .andWhere('user.base_user_id =' + `'${data.baseuserid}'`).groupBy('wrapper.pk').orderBy('count', 'DESC').limit(1)

        // TO GET THE RECENTLY USED SERVICE.
        const qb2 = await getRepository(User)
            .createQueryBuilder("user")
            .innerJoin('user.clientUsers', 'clientUsers', 'user.pk = clientUsers.pk')
            .innerJoin('clientUsers.client', 'client', 'client.pk = clientUsers.clientFk')
            .innerJoin('user.invocations', 'invocations', 'user.pk = invocations.user_fk')
            .innerJoin('invocations.wrapperFk', 'wrapper', 'wrapper.pk = invocations.wrapper_fk')
            .select(["wrapper.name", "invocations.invocation_time"])
            .where('invocations.deleted =' + false)
            .andWhere('user.base_user_id =' + `'${data.baseuserid}'`).orderBy('invocations.invocation_time', 'DESC').limit(1)

        const totalRequest = await qb0.getRawMany();
        const mostUsedService = await qb1.getRawMany();
        const recentlyUsedService = await qb2.getRawMany();

        //TO GET THE WALLET BALANCE.
        //THIS WILL CHECK IF CLIENT ALREADY HAVE WALLET?
        const checkWallet = await getRepository(Wallet)
            .createQueryBuilder("Wallet")
            .andWhere("Wallet.clientFk =" + clientUser.client_fk)
            .getMany()

        let walletAmount = "0.00";
        //IF WALLET FOUND THEN WE CALL THE API TO CHECK WALLET BALANCE.
        if (checkWallet.length > 0) {
            const connection = getConnectionManager().get();
            let productCode = await connection.getRepository(Settings).findOne({ name: 'BILLABLE PRODUCT CODE' });
            let walletCode = await connection.getRepository(Settings).findOne({ name: 'BILLABLE WALLET CODE' });
            let strBaseUrl = await connection.getRepository(Settings).findOne({ name: 'BILLABLE API URL' });
            let walletAuthToken = await connection.getRepository(Settings).findOne({ name: 'WALLET_AUTH_TOKEN' });

            //THIS WILL FETCH CLIENT'S EMAIL.
            const clientProfile = await getRepository(ClientProfile)
                .createQueryBuilder("ClientProfile")
                .andWhere("ClientProfile.client_pk =" + clientUser.client_fk)
                .getMany()

            //IF EMAIL NOT EXIST FOR THE CLIENT THEN WE THROW THE EXCEPTION.
            if (clientProfile[0].email == null) {
                throw new HttpException('email not found for the client', HttpStatus.NOT_FOUND);
            }

            //SET REQUEST PARAMETER 
            const obj = {
                "customerEmail": clientProfile[0].email,
                "productCode": productCode.value,
                "walletCode": walletCode.value
            }

            //SET HEADERS 
            const headersRequest = {
                'Authorization': `Bearer ${walletAuthToken.value}`
            };

            await axios.post(strBaseUrl.value + '/wallet/customer-balance', obj, { headers: headersRequest }).then(async res => {
                if (res.status === 200) {
                    if (res.data.code === 0)
                        walletAmount = res.data.amount;
                }
            })
        }

        return {
            totalRequest: totalRequest,
            mostUsedService: mostUsedService,
            recentlyUserService: recentlyUsedService,
            walletAmount: walletAmount
        };
    }

    async getCustomerBillingDetails(page: number, limit: number, data: CustomerBillingDetailsDto) {
        // TO GET THE BILLING WRAPPER SERVICE NAME.
        const connection = getConnectionManager().get();
        const clientUser = await this.getLogedInUserDeatils(data.baseuserid)
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        var qb0 = `SELECT tblCustomerBilling.* FROM (SELECT CONCAT("band"."minimum_units", '-', "band"."maximum_units") AS bandLimit,
        "wrapper"."pk" as wrapper_id, "wrapper"."name" as wrapper_name, 
        "wrapperServiceProviders"."service_provider_fk" as service_provider_fk, 
        "wrapper"."description" as wrapper_description,
        "band"."band_price" as band_price, "wrapper"."service_type" as service_type, 
        "band"."_order" as bandOrder, "band"."pk" as band_pk 
        FROM "public"."customer_bands" "customerBands" INNER JOIN "public"."band" "band" ON "band"."pk"="customerBands"."band_fk" 
        INNER JOIN "public"."wrapper_service_providers" "wrapperServiceProviders" ON "wrapperServiceProviders"."pk"="customerBands"."wrapper_service_provider_fk" 
        INNER JOIN "public"."wrapper" "wrapper" ON "wrapper".pk = "wrapperServiceProviders"."wrapper_fk"
        INNER JOIN "public"."clientkeys" "clientkeys" ON "clientkeys"."client_fk"="customerBands"."client_fk" AND  "clientkeys"."wrapper_fk" = "wrapperServiceProviders"."wrapper_fk"
        WHERE "customerBands"."client_fk" = ${clientUser.client_fk}
        AND "wrapperServiceProviders"."active" = true 
        AND "clientkeys"."custom_band_enabled" = true
        UNION ALL
        SELECT CONCAT("band"."minimum_units", '-', "band"."maximum_units") AS bandLimit,
       "wrapper"."pk" as wrapper_id, "wrapper"."name" as wrapper_name, 
       "wrapperServiceProviders"."service_provider_fk" as service_provider_fk, 
       "wrapper"."description" as wrapper_description, "band"."band_price" as band_price,
       "wrapper"."service_type" as service_type, "band"."_order" as bandOrder, "band"."pk" as band_pk 
       FROM "public"."band" "band" INNER JOIN "public"."wrapper_service_providers" "wrapperServiceProviders" ON "wrapperServiceProviders"."pk"="band"."wrapper_service_provider_fk" 
       INNER JOIN "public"."wrapper" "wrapper" ON "wrapper"."pk"="wrapperServiceProviders"."wrapper_fk" 
       INNER JOIN "public"."clientkeys" "clientkeys" ON "clientkeys"."wrapper_fk" = "wrapperServiceProviders"."wrapper_fk"
       WHERE "band"."custom" = false 
       AND "clientkeys"."client_fk" = ${clientUser.client_fk}
       AND "wrapperServiceProviders"."active" = true 
       AND "clientkeys"."custom_band_enabled" = false
       AND "band"."_order" = 1 ORDER BY bandOrder) AS tblCustomerBilling WHERE 1=1`

        if (data.serviceType)
            qb0 += `AND tblCustomerBilling.service_type ILIKE '%${data.serviceType}%'`

        if (data.wrapperId)
            qb0 += `AND tblCustomerBilling.wrapper_id = ${data.wrapperId}`

        //THIS WILL FETCH TOTAL NUMBER OF RECORDS.
        const totalCount = await connection.getRepository(CustomerBands)
        .query(`SELECT COUNT(*) FROM (`+ qb0 + `) as TotalCount`)

        //THIS WILL APPLY PAGINATION AND LIMIT.
        const customer_billing_details = await connection.getRepository(CustomerBands)
            .query(qb0 + ` LIMIT ` + limit + `OFFSET ` + (limit * (page - 1)))

        return {
            customer_billing_details: customer_billing_details,
            totalCount: totalCount[0]["count"]
        };
    }

    async getCustomerBillingBandDetails(data: CustomerBillingBandDetailsDto) {
        // TO GET THE BILLING BAND DETAILS.
        const clientUser = await this.getLogedInUserDeatils(data.baseuserid)
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        let qb0: any;
        let billing_band_details = [];
        //This will check value of custom_band_enabled from the clientkey table.
        const customerBandCount = await getRepository(Clientkeys)
            .createQueryBuilder("Clientkeys")
            .andWhere("Clientkeys.client_fk =" + clientUser.client_fk)
            .andWhere("Clientkeys.wrapper_fk =" + data.wrapperid)
            .getMany()

        if(customerBandCount.length > 0){
            if (customerBandCount[0].customBandEnabled) {
                qb0 = await getRepository(CustomerBands)
                    .createQueryBuilder("customerBands")
                    .innerJoinAndSelect('customerBands.band', 'band', 'customerBands.band_fk = band.cumtomerBrandFk')
                    .innerJoinAndSelect('customerBands.wrapperVerificationProviderFK', 'wrapperServiceProviders', 'customerBands.wrapperVerificationProviderFK = wrapperServiceProviders.pk')
                    .innerJoinAndSelect('wrapperServiceProviders.wrapperFk2', 'wrapper', 'wrapper.pk = wrapperServiceProviders.wrapper_fk')
    
                    .select([
                        "band.band_name as band_name",
                        "band.maximum_units + band.minimum_units as band_limit",
                        "band.band_price as band_price",
                        "band.minimum_units as band_min_units",
                        "band.maximum_units as band_max_units",
                        "band._order as band_order",
                        "band.pk as band_id",
                        "wrapper.pk"
                    ])
                    .where('customerBands.client_fk =' + `'${clientUser.client_fk}'`)
                    .andWhere('wrapperServiceProviders.wrapper_fk =' + `'${data.wrapperid}'`)
                    .andWhere('wrapperServiceProviders.active = true')
                    .orderBy('band._order')
            } else {
                qb0 = await getRepository(Band)
                    .createQueryBuilder("band")
                    .innerJoinAndSelect('band.wrapperVerificationProviderFK', 'wrapperServiceProviders', 'band.wrapperVerificationProviderFK = wrapperServiceProviders.pk')
                    .innerJoinAndSelect('wrapperServiceProviders.wrapperFk2', 'wrapper', 'wrapper.pk = wrapperServiceProviders.wrapper_fk')
    
                    .select([
                        "band.band_name as band_name",
                        "band.maximum_units + band.minimum_units as band_limit",
                        "band.band_price as band_price",
                        "band.minimum_units as band_min_units",
                        "band.maximum_units as band_max_units",
                        "band._order as band_order",
                        "band.pk as band_id",
                        "wrapper.pk"
                    ])
                    .where('band.custom = false')
                    .andWhere('wrapperServiceProviders.wrapper_fk =' + `'${data.wrapperid}'`)
                    .andWhere('wrapperServiceProviders.active = true')
                    .orderBy('band._order')
            }

            billing_band_details = await qb0.getRawMany();
        }
        
        return billing_band_details;
    }

    async getWrapperService(data: BillingDto) {
        const clientUser = await this.getLogedInUserDeatils(data.baseuserid)
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const qb0 = await getRepository(Wrapper)
            .createQueryBuilder("wrapper")
            .innerJoinAndSelect('wrapper.clientkeys', 'clientkeys', 'clientkeys.wrapper_fk = wrapper.pk')
            .select(["DISTINCT wrapper.pk as wrapper_id", "wrapper.name as wrapper_name"])
            .andWhere("clientkeys.client_fk =" + clientUser.client_fk)
            .andWhere("wrapper.deleted = false")
            .andWhere("wrapper.active = true")

        const wrapperService = await qb0.getRawMany();
        return wrapperService;
    }

}
