import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, ILike, getConnectionManager } from 'typeorm';

import { BulkVerifications } from '../entity/bulkverifications.entity';
import { User } from '../entity/user.entity';

import { BulkVerificationDto } from './dto/bulk-verification.dto';
import { BulkVerificationTransactionDto } from './dto/bulk-verificationTransaction.dto';
import { BulkVerificationStatisticDto } from './dto/bulk-verificationStatistic.dto';
import { BulkVerificationWrapperDto } from './dto/bulk-verificationWrapper.dto';
import { BulkUploadDto } from './dto/bulk-upload.dto';
import * as XLSX from 'xlsx';
import { Invocations } from '../entity/invocations.entity';
import { Settings } from '../entity/settings.entity';
import { Wrapper } from '../entity/wrapper.entity';
import { BvnInvocations } from '../entity/bvnInvocations.entity';
import { IdInvocations } from '../entity/idInvocations.entity';
import { Clientkeys } from '../entity/clientkeys.entity';
const { getJsDateFromExcel } = require("excel-date-to-js");
var randomize = require('randomatic');

@Injectable()
export class BulkVerificationService {
    constructor(
        @InjectRepository(BulkVerifications)
        private readonly bulkVerificationsRepository: Repository<BulkVerifications>,
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

    async bulkVerifications(page: number, limit: number, data: BulkVerificationDto) {
        const connection = getConnectionManager().get();
        const clientUser = await this.getLogedInUserDeatils(data.baseuserid)
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        var Query = `select bulk_verifications.pk,
        bulk_verifications.bulk_id as "bulkJobId",
        bulk_verifications.wrapper_fk as "wrapperFk",
        bulk_verifications.no_of_transaction as "noOfTransaction",
        bulk_verifications.user_fk as "userFk",
        bulk_verifications.created_date as "bulkInitiatedDate",
        bulk_verifications.modified_date as "modifiedDate",
        bulk_verifications.status as "status",
        bulk_verifications.success_count as "successCount",
        bulk_verifications.failure_count as "failureCount",
        public."user".firstname || ' ' || public."user".surname as "userName",
        public."user".userid,
        wrapper.name as "serviceName"
        from bulk_verifications 
        INNER JOIN public."user" ON public."user".pk = bulk_verifications.user_fk
        INNER JOIN client_user ON client_user.pk = "user".pk
        INNER JOIN wrapper ON wrapper.pk = bulk_verifications.wrapper_fk
        WHERE client_user.client_fk = (select client_fk from client_user where pk =` + clientUser.clientUsers_pk + `)`

        //THIS WILL FILTER THE RECORDS ACCORDING TO THE BODY PARAMETERS.
        if (data.status)
            Query += ` AND bulk_verifications.status ILIKE '` + data.status + `'`

        if (data.search)
            Query += ` AND (bulk_verifications.bulk_id ILIKE '%` + data.search + `%' OR public."user".userid ILIKE '%` + data.search + `%')`

        //THIS WILL APPLY PAGINATION AND LIMIT.
        const bulkVerifications = await connection.getRepository(BulkVerifications)
            .query(Query + ` LIMIT ` + limit + `OFFSET ` + (limit * (page - 1)))

        //THIS WILL FETCH NO OF ONGOING VERIFICATIONS.
        const noOfOngoingVerifications = await connection.getRepository(BulkVerifications)
            .query(`SELECT COUNT(*) FROM (` + Query + `) as TotalCount WHERE TotalCount.status ILIKE 'RUNNING'`)

        //THIS WILL FETCH TOTAL NUMBER OF RECORDS.
        const totalCount = await connection.getRepository(BulkVerifications)
            .query(`SELECT COUNT(*) FROM (` + Query + `) as TotalCount`)

        //THIS WILL FETCH MOST USED SERVICE.
        const mostUsedService = await connection.getRepository(BulkVerifications)
            .query(`select  COUNT(*),tblMostUsedService."serviceName" FROM (` + Query + `) as tblMostUsedService 
        GROUP BY tblMostUsedService."serviceName"
        ORDER BY count DESC
		limit 1`)

        return {
            bulkVerifications: bulkVerifications,
            totalCount: totalCount[0]["count"],
            totalOnGoingVerifications: noOfOngoingVerifications[0]["count"],
            mostUsedService: mostUsedService
        };
    }

    async bulkWiseTransactions(page: number, limit: number, data: BulkVerificationTransactionDto) {
        var connection = getConnectionManager().get();
        const clientUser = await this.getLogedInUserDeatils(data.baseuserid)
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        var Query = `SELECT wrapper.pk as "wrapper_pk",
        invocations.pk as "transaction_pk",
        transaction_ref as "verificationId",
        wrapper.name as "serviceUsed",
        invocations.invocation_time as "transactionDate",
        invocations.amount,
        invocations.transaction_status as "transactionStatus",
        invocations.verification_status_string as "verificationStatus",
        invocations.invocation_time as "paymentTime",
        invocations.response_time as "responseTime",
        public."user".firstname || ' ' || public."user".surname as "userName",
        bulk_verifications.bulk_id as "bulkId",
        invocations.failure_reason as "failureReason"
        FROM invocations INNER JOIN wrapper ON wrapper.pk = invocations.wrapper_fk
        INNER JOIN public."user" ON public."user".pk = invocations.user_fk
        INNER JOIN client_user ON client_user.pk = "user".pk
        INNER JOIN bulk_verifications ON bulk_verifications.pk = invocations.bulk_fk
        WHERE invocations.deleted = false AND client_user.client_fk = (select client_fk from client_user where pk =` + clientUser.clientUsers_pk + `)
        AND bulk_id ='` + data.bulkId + `'`

        //THIS WILL FILTER THE RECORDS ACCORDING TO THE BODY PARAMETERS.
        if (data.invocationStatus)
            Query += ` AND invocations.transaction_status ILIKE '` + data.invocationStatus + `'`

        if (data.verificationStatus)
            Query += ` AND invocations.verification_status_string ILIKE '` + data.verificationStatus + `'`

        if (data.search)
            Query += ` AND (invocations.transaction_ref ILIKE '%` + data.search + `%' OR wrapper.name ILIKE '%` + data.search + `%')`

        //THIS WILL APPLY PAGINATION AND LIMIT.
        const bulkVerifications = await connection.getRepository(BulkVerifications)
            .query(Query + ` LIMIT ` + limit + `OFFSET ` + (limit * (page - 1)))

        //THIS WILL FETCH TOTAL NUMBER OF RECORDS.
        const totalCount = await connection.getRepository(BulkVerifications)
            .query(`SELECT COUNT(*) FROM (` + Query + `) as TotalCount`)

        return {
            bulkVerifications: bulkVerifications,
            totalCount: totalCount[0]["count"],
        };
    }

    async bulkTransactionStatistics(data: BulkVerificationStatisticDto) {
        var connection = getConnectionManager().get();
        var Query1 = `select no_of_transaction - (success_count + failure_count) as "noOfPendingTransaction" ,
        (((no_of_transaction - (success_count + failure_count)) * 100) / bulk_verifications.no_of_transaction)  as "perNoOfPendingTransaction" 
        from bulk_verifications where bulk_id = '` + data.bulkId + `'`

        var Query2 = `select failure_count as "noOfFailedTransaction" ,
        (((bulk_verifications.failure_count) * 100) / bulk_verifications.no_of_transaction)  as "perNoOfFailedTransaction" 
        from bulk_verifications where bulk_id = '` + data.bulkId + `'`

        var Query3 = `select success_count as "noOfSuccessfulTransaction",
        (((bulk_verifications.success_count) * 100) / bulk_verifications.no_of_transaction)  as "perNoOfSuccessTransaction" 
         from bulk_verifications where bulk_id = '` + data.bulkId + `'`

        var Query4 = `select no_of_transaction as "noOfTotalTransaction" from 
        bulk_verifications where bulk_id = '` + data.bulkId + `'`

        var Query5 = `select count(*) as "noOfVerifiedTransaction" 
        from invocations INNER JOIN bulk_verifications ON bulk_verifications.pk = invocations.bulk_fk where 
        invocations.verification_status_string ILIKE 'verified'
        and bulk_id = '` + data.bulkId + `'`

        var Query6 = `select count(*) as "noOfUnverifiedTransaction" 
        from invocations INNER JOIN bulk_verifications ON bulk_verifications.pk = invocations.bulk_fk where 
        invocations.verification_status_string ILIKE 'not verified'
        and bulk_id = '` + data.bulkId + `'`

        var Query8 = `select (((` + Query5 + `) * 100) / bulk_verifications.no_of_transaction)  as "perNoOfVerifiedTransaction" 
        from bulk_verifications where bulk_id = '` + data.bulkId + `'`

        var Query9 = `select (((` + Query6 + `) * 100) / bulk_verifications.no_of_transaction)  as "perNoOfUnVerifiedTransaction" 
        from bulk_verifications where bulk_id = '` + data.bulkId + `'`

        //THIS WILL FETCH TOTAL NUMBER OF RECORDS.
        const noOfPendingTransaction = await connection.getRepository(BulkVerifications)
            .query(Query1)

        const noOfFailedTransaction = await connection.getRepository(BulkVerifications)
            .query(Query2)

        const noOfSuccessfulTransaction = await connection.getRepository(BulkVerifications)
            .query(Query3)

        const noOfTotalTransaction = await connection.getRepository(BulkVerifications)
            .query(Query4)

        const noOfVerifiedTransaction = await connection.getRepository(BulkVerifications)
            .query(Query5)

        const noOfUnverifiedTransaction = await connection.getRepository(BulkVerifications)
            .query(Query6)

        const perNoOfVerifiedTransaction = await connection.getRepository(BulkVerifications)
            .query(Query8)

        const perNoOfUnVerifiedTransaction = await connection.getRepository(BulkVerifications)
            .query(Query9)

        return {
            pendingCount: noOfPendingTransaction,
            failedCount: noOfFailedTransaction,
            successCount: noOfSuccessfulTransaction,
            totalCount: noOfTotalTransaction,
            verifiedCount: noOfVerifiedTransaction,
            unverifiedCount: noOfUnverifiedTransaction,
            perVerifiedCount: perNoOfVerifiedTransaction,
            perUnverifiedCount: perNoOfUnVerifiedTransaction
        };
    }

    async wrapperServiceForBulk(data:BulkVerificationWrapperDto) {
        var connection = getConnectionManager().get();
        const clientUser = await this.getLogedInUserDeatils(data.baseuserid)
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        var Query = `SELECT  DISTINCT wrapper.pk,
        wrapper.name,
		wrapper.bulk_template_link as "templateLink",
		wrapper.bulk_enabled as "bulkEnabled",
		CASE WHEN clientkeys.is_live ISNULL THEN 
		false
		ELSE
		clientkeys.is_live END AS "isLive"
        FROM wrapper
        LEFT JOIN clientkeys ON clientkeys.wrapper_fk  = wrapper.pk AND clientkeys.client_fk =` +  clientUser.client_fk +`
        WHERE wrapper.bulk_enabled = true 
        AND wrapper.deleted = false
        AND wrapper.active = true`

        const wrapperService = await connection.getRepository(BulkVerifications)
            .query(Query)

        return {
            wrapperService: wrapperService
        };
    }

    //THIS WILL UPLOAD DATA IN BULK_VERIFICATIONS,INVOCATIONS AND IT'S SUB TABLES.
    async verifyBulkUpload(data: BulkUploadDto) {
        const clientUser = await this.getLogedInUserDeatils(data.baseuserid)
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const connection = getConnectionManager().get();

        const buffer = Buffer.from(data.base64, 'base64')
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        const sheetNamesList = workbook.SheetNames
        var worksheet = workbook.Sheets[sheetNamesList[0]];

        // GET THE RANGE OF WORK SHEET.
        var range = XLSX.utils.decode_range(worksheet['!ref']);
        let headerIndex = null;
        // LOOP OVER THE RANGE
        for (var row = range.s.r; row <= range.e.r; row++) {
            var getValue = false;
            for (var col = range.s.c; col <= range.e.c; col++) {
                var cell_address = { c: col, r: row };
                headerIndex = row;
                if (worksheet[XLSX.utils.encode_cell(cell_address)] != undefined && worksheet[XLSX.utils.encode_cell(cell_address)].v == "#Header#") {
                    getValue = true;
                    break;
                }
            }
            if (getValue == true) {
                break;
            }
        }
        headerIndex = headerIndex + 1;

        const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesList[0]], { blankrows: false, range: headerIndex })

        //TOTAL NO OF RECORDS IN EXCEL FILE.
        const totalRecord = excelData.length;

        //THIS WILL FETCH NUMBER TO GENERATE AUTO BULK JOB ID.
        let languageSettings = await connection.getRepository(Settings).findOne({ name: 'BULK_JOB_AUTO_ID' });
        //THIS WILL FETCH NUMBER TO GENERATE AUTO API KEY.
        let languageSettingsForApiKey = await connection.getRepository(Settings).findOne({ name: 'API_KEY_AUTO_ID' });

        //THIS WILL FETCH REQUIRED DETAILS OF WRAPPER FROM WRAPPER TABLE.
        let wrapper = await connection.getRepository(Wrapper).findOne({ pk: data.wrapperFk.toString() });

        //THIS WILL CHECK IF API KEY IS EXIST FOR PARTICULAR CLIENT AND WRAPPER?
        let apiKey;
        const clientKeys = await getRepository(Clientkeys)
            .createQueryBuilder("Clientkeys")
            .andWhere("Clientkeys.clientFk =" + clientUser.client_fk)
            .andWhere("Clientkeys.wrapperFk =" + data.wrapperFk)
            .getMany()

        if (clientKeys.length > 0) {
            //IF EXIST THEN USE THAT KEY.
            apiKey = clientKeys[0]["key"];
        }
        else {
            //IF NOT EXIST THEN GENERATE RANDOM KEY.
            apiKey = randomize('Aa0', languageSettingsForApiKey.value);
            //THIS WILL CHECK API KEY ID IS EXIST OR NOT ?
            const isAPIKeyExist = await connection.getRepository(Clientkeys)
                .count({ key: apiKey })

            if (isAPIKeyExist > 0)
                apiKey = randomize('Aa0', languageSettings.value);

            await connection.getRepository(Clientkeys)
                .insert(
                    {
                        dateCreated: new Date(),
                        lastModification: new Date(),
                        deleted: false,
                        createdBy: null,
                        failureCharge: '0.00',
                        instance: null,
                        isLive: false,
                        negotiated: '0.00',
                        successCharge: '0.00',
                        Wrapper_FK1: data.wrapperFk,
                        serviceProvider: null,
                        Client_FK1: clientUser.client_fk,
                        key: apiKey
                    }
                )
        }

        //UNIQUE BULK JOB ID PROCESS.
        let maxNumber = parseInt(languageSettings.value) + 2;
        let bulkJobId = Math.random().toString().substring(2, maxNumber);

        //THIS WILL CHECK BULKJOB ID IS EXIST OR NOT ?
        const isBulkJobIdExist = await connection.getRepository(BulkVerifications)
            .count({ bulk_id: bulkJobId })

        if (isBulkJobIdExist > 0)
            bulkJobId = Math.random().toString().substring(2, maxNumber);

        //INSERT DATA IN BULK_VERIFICATION TABLE.
        let userPk = await connection.getRepository(User).findOne({ pk: clientUser.clientUsers_pk });
        if (!userPk) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        let createBulkJob = await connection.getRepository(BulkVerifications)
            .insert({
                bulk_id: bulkJobId.toString(),
                wrapper_fk: data.wrapperFk.toString(),
                no_of_transaction: totalRecord.toString(),
                userFk: clientUser.clientUsers_pk.toString(),
                created_date: new Date(),
                modified_date: new Date(),
                status: 'RUNNING',
                success_count: '0',
                failure_count: '0'
            })

        //INSERT DATA IN INVOCATION TABLE.
        for (const index in excelData) {
            let createInvocation = await connection.getRepository(Invocations)
                .insert({
                    type: wrapper.type,
                    dateCreated: new Date(),
                    lastModification: new Date(),
                    deleted: false,
                    processingError: null,
                    apiKey: apiKey,
                    status: null,
                    invocationTime: new Date(),
                    transactionRef: null,
                    failureReason: null,
                    providerInvocationId: null,
                    serviceProvider: null,
                    createdBy: null,
                    amount: null,
                    refundAmount: null,
                    transactionStatus: null,
                    bulk_fk: createBulkJob.identifiers[0].pk,
                    wrapper_fk: data.wrapperFk,
                    user_fk: clientUser.clientUsers_pk,
                    transaction_type: 'BULK',
                    response_time: null,
                    wrapper_name: wrapper.name,
                    userid: userPk.userid,
                    verification_status_string: 'PENDING',
                    _mode:'LIVE'
                })

            if (excelData.hasOwnProperty(index)) {
                let datOfBirth;
                if (excelData[index]["DOB"]) {
                    let birthYear = new Date(getJsDateFromExcel(excelData[index]["DOB"])).getFullYear();
                    let birthMonth = (((new Date(getJsDateFromExcel(excelData[index]["DOB"])).getMonth() + 1) < 10 ? '0' : '') + (new Date(getJsDateFromExcel(excelData[index]["DOB"])).getMonth() + 1));
                    let birthDate = ((new Date(getJsDateFromExcel(excelData[index]["DOB"])).getDate() < 10 ? '0' : '') + (new Date(getJsDateFromExcel(excelData[index]["DOB"])).getDate()));
                    datOfBirth = birthYear + '-' + birthMonth + '-' + birthDate;
                }

                if (wrapper.type == 'BVN_INVOCATION') {
                    await connection.getRepository(BvnInvocations)
                        .insert({
                            bvn: excelData[index]["BVN"],
                            pk: createInvocation.identifiers[0].pk,
                            dateOfBirth: datOfBirth,
                            firstname: excelData[index]["Firstname"],
                            surname: excelData[index]["Surname"],
                            email: excelData[index]["Email"],
                            mobile: excelData[index]["Phone"]
                        })
                }
                else if (wrapper.type == 'ID_INVOCATION') {
                    await connection.getRepository(IdInvocations)
                        .insert({
                            pk: createInvocation.identifiers[0].pk,
                            idNumber: excelData[index]["nin"],
                            dob: '',
                            firstname: '',
                            idType: '',
                            surname: ''
                        })
                }
            }
        }

        //THIS WILL RETURN UNIQUE BULK_JOB ID.
        return {
            bulkJobId: bulkJobId
        };
    }
}
