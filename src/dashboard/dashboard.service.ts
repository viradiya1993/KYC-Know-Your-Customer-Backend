import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnectionManager, getRepository, Repository } from 'typeorm';

import { User } from '../entity/user.entity';
import { DashboardUserActionDto } from './dto/checkUserAction.dto';
import { ClientUser } from '../entity/clientUser.entity';
import { Invocations } from '../entity/invocations.entity';
import { Settings } from '../entity/settings.entity';
import { Wallet } from '../entity/wallet.entity';
import { Client } from '../entity/client.entity';
import { Wrapper } from '../entity/wrapper.entity';
const axios = require('axios');
@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(User)
        private readonly dashboardRepository: Repository<User>,
    ) { }

    // SERVICE TO GET THE LOGEDIN USER DETAILS
    async getLogedInUserDeatils(baseUserId) {
        const qb0 = await getRepository(User)
            .createQueryBuilder("user")
            .innerJoin('user.clientUsers', 'clientUsers', 'user.pk = clientUsers.pk')
            .innerJoin('clientUsers.client', 'client', 'client.pk = clientUsers.clientFk')
            .innerJoin('client.clientProfile', 'clientProfile', 'clientProfile.client_pk = client.pk')
            .select(["clientUsers.pk", "clientUsers.clientFk", "user.userid", "clientProfile.email"])
            .where('user.base_user_id =' + `'${baseUserId}'`)

        const userDetails = await qb0.getRawOne();
        return userDetails
    }

    // GET DASHBOARD CARDS DETIALS
    async createDashboardCards(requestdata, baseuserid) {
        //THIS WILL FETCH CLIENT DEATILS USING BASE USER ID.
        const clientUser = await this.getLogedInUserDeatils(baseuserid)
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        } 

        let smallCardResponse = [];
        let bigCardResponse = [];
        let barChartResponse = [];
        let pieChartResponse = [];
        let progressChartResponse = [];

        // CHECK AND FETCH DETAILS FOR SMALL CARDS AND MAP TO RESPONSE PAYLOAD
        if (requestdata.dashboardRequest.smallCards && requestdata.dashboardRequest.smallCards.length > 0) {
            for (const smallCardsDetails of requestdata.dashboardRequest.smallCards) {
                if (smallCardsDetails.query) {
                    let smallCardQuery = null;
                    if (smallCardsDetails.inclusiveTable !== 'user') {
                        smallCardQuery = `${smallCardsDetails.query} ${clientUser.client_fk}`
                    } else {
                        smallCardQuery = `${smallCardsDetails.query}`
                    }

                    const connection = getConnectionManager().get();
                    const cardsDetails = await connection.getRepository(User).query(smallCardQuery)
                    let responseData = {
                        label: smallCardsDetails.label,
                        logo: smallCardsDetails.logo,
                        menuItems: smallCardsDetails.menuItems,
                        active: smallCardsDetails.active,
                        value: cardsDetails[0].count
                    }
                    smallCardResponse.push(responseData)
                } else {
                    let responseData = {
                        label: smallCardsDetails.label,
                        logo: smallCardsDetails.logo,
                        menuItems: smallCardsDetails.menuItems,
                        active: smallCardsDetails.active,
                        value: null
                    }
                    smallCardResponse.push(responseData)
                }
            }
        }

        // CHECK AND FETCH DETAILS FOR BIG CARDS AND MAP TO RESPONSE PAYLOAD
        if (requestdata.dashboardRequest.bigCards && requestdata.dashboardRequest.bigCards.length > 0) {
            //TO GET THE WALLET BALANCE.
            //THIS WILL CHECK IF CLIENT ALREADY HAVE WALLET?
            let walletBalance = 0.00;
            let walletTopup = 0.00;
            let walletDebit = 0.00;
            const checkWallet = await getRepository(Wallet)
                .createQueryBuilder("Wallet")
                .andWhere("Wallet.clientFk =" + clientUser.client_fk)
                .getMany()

            if (checkWallet.length > 0) {
                const connection = getConnectionManager().get();
                let productCode = await connection.getRepository(Settings).findOne({ name: 'BILLABLE PRODUCT CODE' });
                let strBaseUrl = await connection.getRepository(Settings).findOne({ name: 'BILLABLE API URL' });
                let walletAuthToken = await connection.getRepository(Settings).findOne({ name: 'WALLET_AUTH_TOKEN' });
                let walletCode = await connection.getRepository(Settings).findOne({ name: 'BILLABLE WALLET CODE' });

                //SET HEADERS 
                const headersRequest = {
                    'Authorization': `Bearer ${walletAuthToken.value}`
                };

                await axios.get(strBaseUrl.value + `/transaction-wallet-summary?email=${clientUser.clientProfile_email}&productCode=${productCode.value}&userId=${clientUser.user_base_user_id}&walletCode=${walletCode.value}`, { headers: headersRequest }).then(async res => {
                    if (res.status === 200) {
                        if (res.data.code === 0){
                            walletBalance = res.data.card[0].value;
                            walletTopup = res.data.card[1].value;
                            walletDebit = res.data.card[2].value;
                        }
                    }
                })
            }


            for (const bigCardsDetails of requestdata.dashboardRequest.bigCards) {
                let walletValue;
                if (bigCardsDetails.label == 'Total wallet balance')
                    walletValue = walletBalance;
                else if (bigCardsDetails.label == 'Total Wallet Top-up')
                    walletValue = walletTopup;
                else if (bigCardsDetails.label == 'Total Wallet Debit')
                    walletValue = walletDebit;

                let responseData = {
                    label: bigCardsDetails.label,
                    logo: bigCardsDetails.logo,
                    menuItems: bigCardsDetails.menuItems,
                    active: bigCardsDetails.active,
                    value: walletValue
                }

                bigCardResponse.push(responseData)
            }
        }

        // CHECK AND FETCH DETAILS FOR BARCHART CARDS AND MAP TO RESPONSE PAYLOAD
        if (requestdata.dashboardRequest.barChart && requestdata.dashboardRequest.barChart.length > 0) {
            for (const barChartDetails of requestdata.dashboardRequest.barChart) {
                if (barChartDetails.query) {
                    let barChartCardQuery = `${barChartDetails.query} ${clientUser.client_fk}`;

                    const connection = getConnectionManager().get();
                    const cardsDetails = await connection.getRepository(User).query(barChartCardQuery)
                    let tempCardDetails = JSON.parse(JSON.stringify(cardsDetails))
                    let finalRes = [];
                    if (tempCardDetails.length > 0) {
                        for (const serviceDetails of tempCardDetails) {
                            const index = tempCardDetails.indexOf(serviceDetails)
                            delete serviceDetails.name;
                            let monthlycount = Object.values(serviceDetails);
                            cardsDetails[index]['count'] = monthlycount
                        }

                        for (const serviceDetails of cardsDetails) {
                            finalRes.push({ name: serviceDetails.name, count: serviceDetails.count })
                        }
                    }

                    let responseData = {
                        cardName: barChartDetails.label,
                        dataLabels: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
                        services: finalRes,
                        active: barChartDetails.active
                    }
                    barChartResponse.push(responseData)
                } else {
                    let responseData = {
                        cardName: barChartDetails.label,
                        dataLabels: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
                        services: null,
                        active: barChartDetails.active
                    }
                    barChartResponse.push(responseData)
                }
            }
        }

        // CHECK AND FETCH DETAILS FOR PIECHART CARDS AND MAP TO RESPONSE PAYLOAD
        if (requestdata.dashboardRequest.pieChart && requestdata.dashboardRequest.pieChart.length > 0) {
            for (const pieChartDetails of requestdata.dashboardRequest.pieChart) {
                if (pieChartDetails.query) {
                    let pieChartCardQuery = `${pieChartDetails.query} ${clientUser.client_fk}`;

                    const connection = getConnectionManager().get();
                    const cardsDetails = await connection.getRepository(User).query(pieChartCardQuery)
                    let responseData = {
                        cardName: pieChartDetails.label,
                        dataLabels: ["Successful Request", "Failed Request"],
                        counts: [cardsDetails[0].sucesscount, cardsDetails[0].faildcount],
                        active: pieChartDetails.active
                    }
                    pieChartResponse.push(responseData)
                } else {
                    let responseData = {
                        cardName: pieChartDetails.label,
                        dataLabels: ["Successful Request", "Failed Request"],
                        counts: null,
                        active: pieChartDetails.active
                    }
                    pieChartResponse.push(responseData)
                }
            }
        }

        // CHECK AND FETCH DETAILS FOR PROGRESSCHART CARDS AND MAP TO RESPONSE PAYLOAD
        if (requestdata.dashboardRequest.progressCharts && requestdata.dashboardRequest.progressCharts.length > 0) {
            for (const progressChartDetails of requestdata.dashboardRequest.progressCharts) {
                if (progressChartDetails.query) {
                    let progressChartQuery = null;
                    if (progressChartDetails.inclusiveTable !== 'user') {
                        progressChartQuery = `${progressChartDetails.query} ${clientUser.client_fk}`
                    } else {
                        progressChartQuery = `${progressChartDetails.query}`
                    }

                    const connection = getConnectionManager().get();
                    const cardsDetails = await connection.getRepository(User).query(progressChartQuery)
                    let responseData = {
                        cardName: progressChartDetails.chartLabel,
                        link: progressChartDetails.link,
                        isShowProgress: progressChartDetails.isShowProgress,
                        logo: progressChartDetails.logo,
                        // name: progressChartDetails.name,
                        label: progressChartDetails.label,
                        value: cardsDetails[0].count,
                        valueInPer: cardsDetails[0].percount,
                        chartLabel: progressChartDetails.chartLabel,
                        active: progressChartDetails.active
                    }
                    progressChartResponse.push(responseData)
                } else {
                    let responseData = {
                        cardName: progressChartDetails.chartLabel,
                        link: progressChartDetails.link,
                        isShowProgress: progressChartDetails.isShowProgress,
                        logo: progressChartDetails.logo,
                        label: progressChartDetails.label,
                        // name: progressChartDetails.name,
                        value: null,
                        valueInPer: null,
                        chartLabel: progressChartDetails.chartLabel,
                        active: progressChartDetails.active
                    }
                    progressChartResponse.push(responseData)
                }
            }
        }

        return {
            smallCards: smallCardResponse,
            bigCards: bigCardResponse,
            barChart: barChartResponse,
            pieChart: pieChartResponse,
            progressCharts: progressChartResponse
        };
    }

    // TO FILTER BAR CHART BY YEARS.
    async filterBarCard(requestdata, baseuserid: string, filterByYear: string) {
        //THIS WILL FETCH CLIENT DEATILS USING BASE USER ID.
        const clientUser = await this.getLogedInUserDeatils(baseuserid)
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        } 

        let barChartResponse = [];

        // CHECK AND FETCH DETAILS FOR BARCHART CARDS AND MAP TO RESPONSE PAYLOAD
        if (requestdata.dashboardRequest.barChart && requestdata.dashboardRequest.barChart.length > 0) {
            for (const barChartDetails of requestdata.dashboardRequest.barChart) {
                if (barChartDetails.query) {
                    let searchString = `date_part('year', now())`
                    let filterQuery = barChartDetails.query.split(searchString).join(filterByYear);
                    let barChartCardQuery = `${filterQuery} ${clientUser.client_fk}`;
                    const connection = getConnectionManager().get();
                    const cardsDetails = await connection.getRepository(User).query(barChartCardQuery)
                    let tempCardDetails = JSON.parse(JSON.stringify(cardsDetails))
                    let finalRes = [];
                    if (tempCardDetails.length > 0) {
                        for (const serviceDetails of tempCardDetails) {
                            const index = tempCardDetails.indexOf(serviceDetails)
                            delete serviceDetails.name;
                            let monthlycount = Object.values(serviceDetails);
                            cardsDetails[index]['count'] = monthlycount
                        }

                        for (const serviceDetails of cardsDetails) {
                            finalRes.push({ name: serviceDetails.name, count: serviceDetails.count })
                        }
                    }

                    let responseData = {
                        cardName: barChartDetails.label,
                        dataLabels: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
                        services: finalRes,
                        active: barChartDetails.active
                    }
                    barChartResponse.push(responseData)
                } else {
                    let responseData = {
                        cardName: barChartDetails.label,
                        dataLabels: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
                        services: null,
                        active: barChartDetails.active
                    }
                    barChartResponse.push(responseData)
                }
            }
        }

        return {
            barChart: barChartResponse,
        };
    }

    //THIS WILL CHECK USER ACTION FOR NEW USER DASHBOARD.
    async checkUserAction(data: DashboardUserActionDto, authToken) {
        //THIS WILL FETCH CLIENT DEATILS USING BASE USER ID.
        const clientUser = await this.getLogedInUserDeatils(data.baseuserid)
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        var connection = getConnectionManager().get();
        //THIS WILL CHECK WALLET BALANCE.
        let walletBalance;
        let wallet = false;
        //THIS WILL FETCH DEFAULT WALLET BALANCE FROM THE SETTING TABLE.
        let defaultWalletAmount = await connection.getRepository(Settings).findOne({ name: 'DEFAULT_WALLET_AMOUNT' });
        //THIS WILL CHECK IF CLIENT ALREADY HAVE WALLET?
        const checkWallet = await getRepository(Wallet)
            .createQueryBuilder("Wallet")
            .andWhere("Wallet.clientFk =" + clientUser.client_fk)
            .getMany()
        //IF WALLET FOUND THEN WE CALL THE API TO CHECK WALLET BALANCE.
        if (checkWallet.length > 0) {
            let walletId = checkWallet[0]["wallet_id"];
            //IF WALLET ID IS NOT NULL THEN WE CALL THE API TO CHECK WALLET BALANCE.
            if (walletId != null) {
                walletBalance = checkWallet[0]["last_known_balance"];
                if (parseInt(walletBalance) > parseInt(defaultWalletAmount.value))
                    wallet = true;
                else
                    wallet = false;
            }
        }
        else {
            wallet = false;
        }

        //THIS WILL CHECK IF CLIENT HAS MORE THEN ONE USER.
        let invitedUser;
        let modeLive;
        let modeTest;
        let companyVerified;
        const Query1 = await getRepository(ClientUser)
            .createQueryBuilder("ClientUser")
            .where("ClientUser.client_fk = " + clientUser.client_fk)
            .getCount()

        if (Query1 > 1)
            invitedUser = true
        else
            invitedUser = false

        //THIS WILL CHECK IF THERE IS A RECORD OF MODE LIVE IN INVOCATION TABLE.
        var qb2 = `SELECT COUNT(*) FROM invocations INNER JOIN client_user ON client_user.pk = invocations.user_fk
        and invocations._mode ILIKE 'LIVE'
        and client_user.client_fk=` + clientUser.client_fk

        const Query2 = await connection.getRepository(Invocations)
            .query(qb2)

        if (Query2[0].count > 0)
            modeLive = true
        else
            modeLive = false

        //THIS WILL CHECK IF THERE IS A RECORD OF MODE TEST IN INVOCATION TABLE.
        var qb3 = `SELECT COUNT(*) FROM invocations INNER JOIN client_user ON client_user.pk = invocations.user_fk
        and invocations._mode ILIKE 'TEST'
        and client_user.client_fk=` + clientUser.client_fk

        const Query3 = await connection.getRepository(Invocations)
            .query(qb3)

        if (Query3[0].count > 0)
            modeTest = true
        else
            modeTest = false

        //THIS WILL CHECK IF THE COMPANY IS VERIFIED OR NOT ?
        const Query4 = await getRepository(Client)
            .createQueryBuilder("client")
            .where("client.pk = " + clientUser.client_fk)
            .andWhere("client.activation_status ILIKE 'APPROVED'")
            .getCount()

        if (Query4 > 0)
            companyVerified = true
        else
            companyVerified = false

        //THIS WILL CHECK IF THE FREE RC VERIFICATION AND NUMBER OF RC VERIFICATION
        const clientWrapper = await getRepository(Wrapper)
            .createQueryBuilder("wrapper")
            .leftJoinAndSelect('wrapper.wrapperServiceProviders', 'WrapperServiceProviders', 'WrapperServiceProviders.wrapper_fk = wrapper.pk')
            .leftJoinAndSelect('WrapperServiceProviders.serviceProviderFk2', 'vsp', 'vsp.pk = WrapperServiceProviders.service_provider_fk')
            .leftJoinAndSelect('wrapper.wrapperDetails', 'WrapperDetail', 'WrapperDetail.wrapper_fk = wrapper.pk')
            .select([
                "wrapper.pk",
                "wrapper.name",
                "wrapper.verification_type",
                'wrapper.header_description',
                'WrapperServiceProviders.wrapper_fk',
                'WrapperServiceProviders.wrapperFk',
                'WrapperDetail.id',
                'WrapperDetail.active',
                'WrapperDetail.live_mode_endpoint',
                'WrapperDetail.test_mode_endpoint',
                'WrapperDetail.form_json',
                'vsp.pk',
                'vsp.logo',
            ])
            .andWhere("wrapper.verification_type ILIKE 'RC-VERIFICATION'")
            .getOne()

        //THIS WILL GET THE CLIENTKEYS OF WRAPPER WHERE VERIFICATION TYPE = RC-VERIFICATION
        const clinetkeys = await getRepository(Wrapper)
            .createQueryBuilder("wrapper")
            .leftJoinAndSelect('wrapper.clientkeys', 'clientkeys', 'clientkeys.wrapper_fk = wrapper.pk')
            .select([
                "clientkeys.client_fk",
                "clientkeys.pk",
                "clientkeys.key",
                "clientkeys.is_live",
            ])
            .andWhere("wrapper.verification_type ILIKE 'RC-VERIFICATION'")
            .andWhere("clientkeys.client_fk =" + clientUser.client_fk)
            .getRawOne()

        //THIS WILL GET THE CLIENT DETAILS
        const client = await getRepository(Client)
            .createQueryBuilder("Client")
            .select(['Client.pk', 'Client.freeRcVerificationCount', 'Client.freeRcVerificationEligibility'])
            .andWhere("Client.pk =" + clientUser.client_fk)
            .getOne()

        let apiKey = await connection.getRepository(Settings).findOne({ name: 'seamfix.admin.apiKey' });
        let userId = await connection.getRepository(Settings).findOne({ name: 'seamfix.admin.userid' });

        return {
            userActions: {
                wallet: wallet,
                invitedUser: invitedUser,
                modeTest: modeTest,
                modeLive: modeLive,
                companyVerified: companyVerified,
                wrapperDetails: clientWrapper,
                clientDetails: client,
                clinetkeys: clinetkeys
            },
            userid: clientUser.user_userid,
            apiKey: apiKey.value,
            userId:userId.value
        };
    }
}
