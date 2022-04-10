import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, getConnectionManager } from 'typeorm';

import { Wrapper } from '../entity/wrapper.entity';
import { VerificationServiceProvider } from '../entity/verificationserviceprovider.entity';
import { WrapperDto } from './dto/wrapper.dto';
import { WrapperListDto } from './dto/wrapperList.dto';
import { Clientkeys } from '../entity/clientkeys.entity';
import { timestamp } from 'rxjs/operators';
import { User } from '../entity/user.entity';
import { Settings } from '../entity/settings.entity';
import { selectObjectFields } from 'graphql-tools';
import { WalletDto } from './dto/wallet.dto';
import { Wallet } from '../entity/wallet.entity';
import { Bank } from '../entity/bank.entity';
import { VirtualAccount } from '../entity/virtualAccount.entity';
import { ClientProfile } from '../entity/clientProfile.entity';
import { Client } from '../entity/client.entity';
import { WalletDetailsDto } from './dto/walletDetails.dto';
import { CustomerBands } from '../entity/customerBand.entity';
import { Band } from '../entity/band.entity';
var randomize = require('randomatic');
const axios = require('axios');

@Injectable()
export class WrapperService {
    constructor(
        @InjectRepository(Wrapper)
        private readonly wrapperRepository: Repository<Wrapper>,
        @InjectRepository(VerificationServiceProvider)
        private readonly verificationSericeRepository: Repository<VerificationServiceProvider>,
        @InjectRepository(Clientkeys)
        private readonly clientkeyRepository: Repository<Clientkeys>
    ) { }

    // SERVICE TO GET THE LOGEDIN USER DETAILS
    async getLogedInUserDeatils(baseUserId) {
        const qb0 = await getRepository(User)
            .createQueryBuilder("user")
            .innerJoin('user.clientUsers', 'clientUsers', 'user.pk = clientUsers.pk')
            .innerJoin('clientUsers.client', 'client', 'client.pk = clientUsers.clientFk')
            .innerJoin('client.clientProfile', 'clientProfile', 'clientProfile.client_pk = client.pk')
            .select(["clientUsers.pk", "clientUsers.clientFk", "userid", "client.name", "user.email", "user.firstname", "user.surname", "user.base_user_id", "clientProfile.phone", "clientProfile.email"])
            .where('user.base_user_id =' + `'${baseUserId}'`)

        const userDetails = await qb0.getRawOne();
        return userDetails
    }

    //This will fetch all the wrappers and show it in the service page.
    async getAllWrapper(page: number, limit: number, data: Partial<WrapperDto>) {
        const clientUser = await this.getLogedInUserDeatils(data.baseuserid)
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const wrappersData = await getRepository(Wrapper)
            .createQueryBuilder("wrapper")
            .leftJoinAndSelect('wrapper.wrapperServiceProviders', 'WrapperServiceProviders', 'WrapperServiceProviders.wrapper_fk = wrapper.pk')
            .leftJoinAndSelect('WrapperServiceProviders.serviceProviderFk2', 'vsp', 'vsp.pk = WrapperServiceProviders.service_provider_fk')
            .leftJoinAndSelect('wrapper.wrapperDetails', 'WrapperDetail', 'WrapperDetail.wrapper_fk = wrapper.pk')
            .select([
                'wrapper.pk',
                'wrapper.name',
                'wrapper.description',
                // 'wrapper.charge', 
                'wrapper.verification_type',
                'wrapper.failureBaseCharge',
                // 'wrapper.lastInvocation', 
                'wrapper.published',
                'wrapper.active',
                'wrapper.successBaseCharge',
                'wrapper.wrapperRef',
                'wrapper.apiDocUrl',
                'wrapper.service_type',
                'wrapper.header_description',
                'WrapperServiceProviders.wrapper_fk',
                'WrapperServiceProviders.wrapperFk',
                'WrapperDetail.id',
                'WrapperDetail.active',
                'WrapperDetail.live_mode_endpoint',
                'WrapperDetail.test_mode_endpoint',
                'WrapperDetail.form_json',
                'vsp.pk',
                'vsp.logo'
            ])
            .andWhere("wrapper.deleted = false")
            .andWhere("wrapper.active = true")
        if (data.serviceType)
            wrappersData.andWhere("wrapper.service_type ILIKE :type ", { type: `${data.serviceType}` })
        if (data.name)
            wrappersData.andWhere("wrapper.name ILIKE :name", { name: `%${data.name}%` })
        if (data.verificationServiceProviderId.length && data.verificationServiceProviderId.length > 0)
            wrappersData.andWhere("vsp.pk IN (:...providerId)", { providerId: data.verificationServiceProviderId })

        wrappersData.take(limit)
            .skip(limit * (page - 1))

        const clientKeys = await getRepository(Clientkeys)
            .createQueryBuilder("Clientkeys")
            .andWhere("Clientkeys.client_fk =" + clientUser.client_fk)
            .getMany()

        const verifiedStatus = await getRepository(Client)
            .createQueryBuilder("client")
            .where("client.pk = " + clientUser.client_fk)
            .getMany()

        const wrappers = await wrappersData.getManyAndCount();

        for (const windex in wrappers[0]) {
            wrappers[0][windex]["clientKeys"] = [];
            for (const cindex in clientKeys) {
                if (wrappers[0][windex]['pk'].toString() === clientKeys[cindex]["Wrapper_FK1"].toString()) {
                    wrappers[0][windex]["lastInvocation"] = clientKeys[cindex]["lastInvocation"]
                    wrappers[0][windex]["clientKeys"] = [{
                        pk: clientKeys[cindex]["pk"],
                        key: clientKeys[cindex]["key"],
                        isLive: clientKeys[cindex]["isLive"],
                        customBandEnabled: clientKeys[cindex]["customBandEnabled"]
                    }];
                    // TO GET THE UNIT COST FROM BAND AND CUSTOMER BAND
                    let qb0: any;
                    if (clientKeys[cindex]["customBandEnabled"] === true) {
                        qb0 = await getRepository(CustomerBands)
                            .createQueryBuilder("customerBands")
                            .innerJoinAndSelect('customerBands.band', 'band', 'customerBands.band_fk = band.cumtomerBrandFk')
                            .innerJoinAndSelect('customerBands.wrapperVerificationProviderFK', 'wrapperServiceProviders', 'customerBands.wrapperVerificationProviderFK = wrapperServiceProviders.pk')
                            .innerJoinAndSelect('wrapperServiceProviders.wrapperFk2', 'wrapper', 'wrapper.pk = wrapperServiceProviders.wrapper_fk')
                            .select(["band.band_price as unit_price"])
                            .where('customerBands.client_fk =' + `'${clientUser.client_fk}'`)
                            .andWhere('customerBands.current_band = true')
                            .andWhere('wrapperServiceProviders.wrapper_fk =' + `'${wrappers[0][windex]['pk']}'`)
                            .andWhere('wrapperServiceProviders.active = true')
                    } else {
                        qb0 = await getRepository(Band)
                            .createQueryBuilder("band")
                            .innerJoinAndSelect('band.wrapperVerificationProviderFK', 'wrapperServiceProviders', 'band.wrapperVerificationProviderFK = wrapperServiceProviders.pk')
                            .innerJoinAndSelect('wrapperServiceProviders.wrapperFk2', 'wrapper', 'wrapper.pk = wrapperServiceProviders.wrapper_fk')
                            .select(["band.band_price as unit_price"])
                            .where('band.custom = false')
                            .andWhere('band._order = 1')
                            .andWhere('wrapperServiceProviders.wrapper_fk =' + `'${wrappers[0][windex]['pk']}'`)
                            .andWhere('wrapperServiceProviders.active = true')
                    }
                    const billing_band_details = await qb0.getRawOne();
                    wrappers[0][windex]["charge"] = billing_band_details ? billing_band_details.unit_price : "0"          
                }
            }
        }

        return {
            wrappers,
            userid: clientUser.userid,
            // clientKeys, 
            verifiedStatus
        }
    }

    //This will fetch all the providers and bind it to the dropdown.
    async getAllVerificationService() {
        const verificationService = await getRepository(VerificationServiceProvider)
            .createQueryBuilder("verificationServiceProvider")
            .innerJoinAndSelect('verificationServiceProvider.wrapperServiceProviders', 'wrapperServiceProviders', 'wrapperServiceProviders.serviceProviderFk2 = verificationServiceProvider.pk')
            .innerJoinAndSelect('wrapperServiceProviders.wrapperFk2', 'wrapper', 'wrapper.pk = wrapperServiceProviders.wrapper_fk')
            .select(['verificationServiceProvider.pk', 'verificationServiceProvider.name'])
            .getMany()

        return verificationService;
    }

    async createOrUpdateAPIKEY(pk, is_live, wrapperfk, baseuserid) {
        let clientKeys;
        const clientUser = await this.getLogedInUserDeatils(baseuserid);
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const connection = getConnectionManager().get();
        if (pk) {
            await connection.getRepository(Clientkeys)
                .update(pk, { isLive: is_live, lastModification: new Date() })
            clientKeys = await connection.getRepository(Clientkeys).findOne({ pk: pk });
        }
        else {
            //THIS WILL FETCH NUMBER TO GENERATE AUTO API KEY.
            let languageSettings = await connection.getRepository(Settings).findOne({ name: 'API_KEY_AUTO_ID' });
            let uniqueAPIKey;
            uniqueAPIKey = randomize('Aa0', languageSettings.value);

            //THIS WILL CHECK API KEY ID IS EXIST OR NOT ?
            const isAPIKeyExist = await connection.getRepository(Clientkeys)
                .count({ key: uniqueAPIKey })

            if (isAPIKeyExist > 0)
                uniqueAPIKey = randomize('Aa0', languageSettings.value);

            let clientKeyData = await connection.getRepository(Clientkeys)
                .insert(
                    {
                        dateCreated: new Date(),
                        lastModification: new Date(),
                        deleted: false,
                        createdBy: 0,
                        failureCharge: '0.00',
                        instance: null,
                        isLive: is_live,
                        negotiated: '0.00',
                        successCharge: '0.00',
                        Wrapper_FK1: wrapperfk,
                        serviceProvider: null,
                        Client_FK1: clientUser.client_fk,
                        key: uniqueAPIKey
                    }
                )
            clientKeys = await connection.getRepository(Clientkeys).findOne({ pk: clientKeyData.identifiers[0].pk });
        }

        return {
            clientKeys: {
                pk: clientKeys.pk,
                is_live: clientKeys.isLive,
                key: clientKeys.key
            }
        };
    }

    //THIS WILL UPDATE DATA IN CLIENT_KEY TABLE AND INSERT IF CLIENT_KEY NOT EXIST.
    async updateClietKeyLiveTest(data: WrapperListDto) {
        let clientKeys;
        if (data.pk) {
            clientKeys = await this.createOrUpdateAPIKEY(data.pk, data.is_live, data.wrapperfk, data.baseuserid);
        }
        else {
            if (data.is_live)
                clientKeys = await this.createOrUpdateAPIKEY(data.pk, data.is_live, data.wrapperfk, data.baseuserid);
            else
                clientKeys = await this.createOrUpdateAPIKEY(data.pk, false, data.wrapperfk, data.baseuserid);
        }

        return clientKeys;
    }

    async createWallet(data: WalletDto) {
        //     let walletResult;
        //     const connection = getConnectionManager().get();
        //     //THIS WILL FETCH CLIENT DEATILS USING BASE USER ID.
        //     const clientUser = await this.getLogedInUserDeatils(data.baseuserid);
        //     if (!clientUser) {
        //         throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        //     }
        //     //THIS WILL CHECK IF CLIENT ALREADY HAVE WALLET?
        //     const wallet = await getRepository(Wallet)
        //         .createQueryBuilder("Wallet")
        //         .andWhere("Wallet.clientFk =" + clientUser.client_fk)
        //         .getMany()

        //     //IF WALLET NOT EXIST THEN WE WILL CALL THE API TO CREATE A WALLET.
        //     if(wallet.length <= 0){
        //     //THIS WILL FETCH CLIENT'S EMAIL.
        //     const clientProfile = await getRepository(ClientProfile)
        //     .createQueryBuilder("ClientProfile")
        //     .andWhere("ClientProfile.client_pk =" + clientUser.client_fk)
        //     .getMany()

        //     //IF EMAIL NOT EXIST FOR THE CLIENT THEN WE THROW THE EXCEPTION.
        //     if(clientProfile[0].email == null ){
        //         throw new HttpException('email not found for the client', HttpStatus.NOT_FOUND);
        //     }

        //     //SET REQUEST PARAMETER FOR THE CREATE WALLET API.
        //     const obj = {
        //         "accountName": clientUser.client_name + " - Verified",
        //         "accountReference": "",
        //         "bvn": null,
        //         "createVirtualAccount": true,
        //         "currencyCode": "NGN",
        //         "customerEmail": clientProfile[0].email,
        //         "customerName": clientUser.client_name,
        //         "description": "",
        //         "enableWithdrawal": true,
        //         "parentWalletID": "",
        //         "subWallet": false,
        //         "userBaseId": data.baseOrg,
        //         "walletOwnerType": "ORGANIZATION",
        //         "walletType": "PAYMENT"
        //     }

        //     //SET HEADERS FOR THE CREATE WALLET API.
        //     const headersRequest = {
        //         'base-org': data.baseOrg,
        //         'base-product': data.baseProduct,
        //         'base-product-user-category-code': data.baseProductUserCategoryCode,
        //         'base-product-user-category-id':data.baseProductUserCategoryId,
        //         'base-user-type':"ORGANIZATION",
        //         'Authorization': `Bearer ${authToken}`
        //     };

        // await axios.post(process.env.WALLET_BASE_URL + 'wallets-base/wallets/create', obj,{headers:headersRequest}).then(async res => {
        //     if (res.data) {
        //     //INSERT DATA IN WALLET TABLE.
        //     let walletData = await connection.getRepository(Wallet)
        //         .insert(
        //             {
        //                 dateCreated: new Date(),
        //                 dateModified: new Date(),
        //                 active: res.data.walletDetails.active,
        //                 wallet_id: res.data.walletDetails.walletId,
        //                 last_known_balance: res.data.walletDetails.balance,
        //                 primary: true,
        //                 clientFk: clientUser.client_fk
        //             }
        //         )

        //     //INSERT DATA IN BANK TABLE.
        //     let bankData = await connection.getRepository(Bank)
        //     .insert(
        //         {
        //             name: res.data.walletDetails.virtualAccount.bankName,
        //             code: res.data.walletDetails.virtualAccount.bankCode,
        //             active: true
        //         }
        //     )

        //    //INSERT DATA IN VIRTUAL ACCOUNT TABLE.
        //    await connection.getRepository(VirtualAccount)
        //    .insert(
        //        {
        //            account_number: res.data.walletDetails.virtualAccount.accountNumber,
        //            dateCreated: new Date(),
        //            active: true,
        //            walletFk: walletData.identifiers[0].pk,
        //            bankFk: bankData.identifiers[0].pk
        //        }
        //    )

        //      walletResult= res.data.walletDetails.walletId;
        //     }
        //     else{
        //         walletResult = null;
        //     }
        // })
        // }
        // else{
        //     walletResult = null;
        // }
        // return walletResult;

        //14-04-2021
        let walletResult = null;
        const connection = getConnectionManager().get();
        //THIS WILL FETCH CLIENT DEATILS USING BASE USER ID.
        const clientUser = await this.getLogedInUserDeatils(data.baseuserid);
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        //THIS WILL CHECK IF CLIENT ALREADY HAVE WALLET?
        const wallet = await getRepository(Wallet)
            .createQueryBuilder("Wallet")
            .andWhere("Wallet.clientFk =" + clientUser.client_fk)
            .getMany()

        //IF WALLET NOT EXIST THEN WE WILL CALL THE API TO CREATE A WALLET.
        if (wallet.length <= 0) {
            //THIS WILL FETCH CLIENT'S EMAIL.
            const clientProfile = await getRepository(ClientProfile)
                .createQueryBuilder("ClientProfile")
                .andWhere("ClientProfile.client_pk =" + clientUser.client_fk)
                .getMany()

            //IF EMAIL NOT EXIST FOR THE CLIENT THEN WE THROW THE EXCEPTION.
            if (clientProfile[0].email == null) {
                throw new HttpException('email not found for the client', HttpStatus.NOT_FOUND);
            }

            let productCode = await connection.getRepository(Settings).findOne({ name: 'BILLABLE PRODUCT CODE' });
            let walletCode = await connection.getRepository(Settings).findOne({ name: 'BILLABLE WALLET CODE' });
            let strBaseUrl = await connection.getRepository(Settings).findOne({ name: 'BILLABLE API URL' });
            let walletAuthToken = await connection.getRepository(Settings).findOne({ name: 'WALLET_AUTH_TOKEN' });

            //SET REQUEST PARAMETER FOR THE CREATE WALLET API.
            const obj = {
                "customerEmail": clientProfile[0].email,
                "customerName": clientUser.client_name,
                "customerPhoneNo": clientProfile[0].phone,
                // "customerUserId": data.baseuserid,
                "customerUserId": clientUser.client_fk,
                "productCode": productCode.value,
                "walletCode": walletCode.value
            }

            //SET HEADERS FOR THE CREATE WALLET API.
            const headersRequest = {
                'Authorization': `Bearer ${walletAuthToken.value}`
            };

            await axios.post(strBaseUrl.value + '/wallet/create-customer-wallet', obj, { headers: headersRequest }).then(async res => {
                let walletData;
                if (res.status === 200) {
                    if (res.data.code === 0) {
                        //INSERT DATA IN WALLET TABLE.
                        walletData = await connection.getRepository(Wallet)
                            .insert(
                                {
                                    dateCreated: new Date(),
                                    dateModified: new Date(),
                                    active: true,
                                    wallet_id: walletCode.value + '_' + clientUser.client_fk,
                                    last_known_balance: "0.00",
                                    primary: true,
                                    clientFk: clientUser.client_fk
                                }
                            )
                    }
                    let wallet = await connection.getRepository(Wallet).findOne({ pk: walletData.identifiers[0].pk });
                    walletResult = wallet.wallet_id;
                }
            })
        }

        return walletResult;
    }

    async walletDetails(data: WalletDetailsDto) {
        const clientUser = await this.getLogedInUserDeatils(data.baseuserid);
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const connection = getConnectionManager().get();
        let productCode = await connection.getRepository(Settings).findOne({ name: 'BILLABLE PRODUCT CODE' });
        let walletCode = await connection.getRepository(Settings).findOne({ name: 'BILLABLE WALLET CODE' });

        return {
            productCode: productCode.value,
            walletCode: walletCode.value,
            userid: clientUser.userid,
            userEmail: clientUser.clientProfile_email,
            customerFirstName: clientUser.firstname,
            customerLastName: clientUser.user_surname,
            customerPhoneNumber: clientUser.clientProfile_phone,
            baseuserid: clientUser.user_base_user_id,
            clientId: clientUser.client_fk
        }

    }
}

