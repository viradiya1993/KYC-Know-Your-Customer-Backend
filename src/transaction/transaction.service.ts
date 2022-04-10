import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnectionManager, getRepository} from 'typeorm';

import { Invocations } from '../entity/invocations.entity';
import { User } from '../entity/user.entity';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionWrapperDto } from './dto/transactionWrapper.dto';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Invocations)
        private readonly invocationRepository: Repository<Invocations>,
    ) {}

    // SERVICE TO GET THE LOGEDIN USER DETAILS
    async getLogedInUserDeatils(baseUserId) {
        const qb0 = await getRepository(User)
            .createQueryBuilder("user")
            .innerJoin('user.clientUsers','clientUsers','user.pk = clientUsers.pk')
            .innerJoin('clientUsers.client','client','client.pk = clientUsers.clientFk')
            .select(["clientUsers.pk"])
            .where('user.base_user_id ='+ `'${baseUserId}'`)

            const userDetails = await qb0.getRawOne();
            return userDetails.clientUsers_pk
    }

    async getAllTransactionHistory(page: number, limit: number,data: TransactionDto) {
            const connection = getConnectionManager().get(); 
            const clientUser = await this.getLogedInUserDeatils(data.baseuserid)
            if (!clientUser) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            var Query = `SELECT wrapper.pk as "wrapper_pk",
            invocations.pk as "transaction_pk",
            transaction_ref as "transactionId",
            wrapper.name as "serviceUsed",
            invocations.verification_status_string as "verificationStatus",
            invocations.amount,
            invocations.transaction_status as "transactionStatus",
            invocations.invocation_time as "paymentTime",
            invocations.response_time as "responseTime",
            public."user".firstname || ' ' || public."user".surname as "userName",
            public."user".email,
            public."user".phoneno,
            public."user".userid,
            invocations.transaction_type as "transactionType",
            bulk_verifications.bulk_id as "bulkId",
            invocations.failure_reason as "failureReason",
            invocations._mode as mode 
            FROM invocations INNER JOIN wrapper ON wrapper.pk = invocations.wrapper_fk
            INNER JOIN public."user" ON public."user".pk = invocations.user_fk
            INNER JOIN client_user ON client_user.pk = "user".pk
            LEFT JOIN bulk_verifications ON bulk_verifications.pk = invocations.bulk_fk
            WHERE invocations.deleted = false AND client_user.client_fk = (select client_fk from client_user where pk =` + clientUser + `)`
            
            //THIS WILL FILTER THE RECORDS ACCORDING TO THE BODY PARAMETERS.
            if(data.transactionStatus)
            Query += ` AND invocations.transaction_status ILIKE '` + data.transactionStatus + `'`

            if(data.verificationStatus)
            Query += ` AND invocations.verification_status_string ILIKE '` + data.verificationStatus + `'`

            if(data.transactionType)
            Query += ` AND invocations.transaction_type ILIKE '` + data.transactionType + `'`

            if(data.serviceUsed && data.serviceUsed.length > 0)
            Query += ` AND wrapper.pk IN (` + data.serviceUsed + `)`

            if(data.fromDate && data.toDate)
            Query += ` AND (DATE(invocations.invocation_time) >= date '` + data.fromDate + `' 
            AND DATE(invocations.invocation_time) <= date '` + data.toDate + `') `

            if(data.search)
            Query += ` AND (invocations.transaction_ref ILIKE '%` + data.search + `%' OR bulk_verifications.bulk_id ILIKE '%` + data.search + `%'
            OR public."user".firstname ILIKE '%` + data.search + `%' OR public."user".surname ILIKE '%` + data.search + `%'
            OR (public."user".firstname || ' ' || public."user".surname) ILIKE '%` + data.search + `%') `

            if(data.mode)
            Query += ` AND invocations._mode ILIKE '` + data.mode + `'`
            
            //THIS WILL APPLY PAGINATION AND LIMIT.
            const invocations = await connection.getRepository(Invocations)
            .query(Query + `ORDER BY invocations.invocation_time DESC LIMIT ` +  limit + `OFFSET ` + ( limit * (page - 1)))

            //THIS WILL FETCH TOTAL NUMBER OF RECORDS.
            const totalCount = await connection.getRepository(Invocations)
            .query(`SELECT COUNT(*) FROM (`+ Query + `) as TotalCount`)
            
            //THIS WILL FETCH TOTAL NUMBER OF RECORDS WHICH IS SUCCESSFULL.
            const totalSuccessCount = await connection.getRepository(Invocations)
            .query(`SELECT COUNT(*) FROM (`+ Query + ` AND invocations.transaction_status = 'SUCCESSFUL') as TotalSuccessCount`)

            //THIS WILL FETCH TOTAL NUMBER OF RECORDS WRAPPER WISE.
            const serviceAnalytics = await connection.getRepository(Invocations)
            .query(`SELECT tblCount.wrapper_pk,tblCount."serviceUsed",COUNT(*) FROM (`+ Query + `) as tblCount GROUP BY tblCount."serviceUsed",tblCount.wrapper_pk`)
             return { 
                 transactions: invocations,
                 serviceAnalytics: serviceAnalytics,
                 totalCount: totalCount[0]["count"],
                 totalSuccessCount: totalSuccessCount[0]["count"]
             };
    }

    async getAllWrapperService(data: TransactionWrapperDto){
        const connection = getConnectionManager().get(); 
        const clientUser = await this.getLogedInUserDeatils(data.baseuserid)
        if (!clientUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const Query = `SELECT DISTINCT wrapper.pk,
            wrapper.name as "serviceUsed"
            FROM invocations INNER JOIN wrapper ON wrapper.pk = invocations.wrapper_fk
            INNER JOIN public."user" ON public."user".pk = invocations.user_fk
            INNER JOIN client_user ON client_user.pk = "user".pk
            LEFT JOIN bulk_verifications ON bulk_verifications.pk = invocations.bulk_fk
            WHERE invocations.deleted = false AND client_user.client_fk = (select client_fk from client_user where pk =` + clientUser + `)`

           //THIS WILL FETCH WRAPPER SERVICE WHICH USED IN TRANSACTION.
           const serviceUsed = await connection.getRepository(Invocations)
           .query(Query)

        return serviceUsed;
    }
}