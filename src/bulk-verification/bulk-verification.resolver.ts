import { Args, Query, Resolver } from '@nestjs/graphql';
import { BulkVerificationService } from './bulk-verification.service';

import { BulkVerificationDto } from './dto/bulk-verification.dto';
import { BulkVerificationTransactionDto } from './dto/bulk-verificationTransaction.dto';
import { BulkVerificationStatisticDto } from './dto/bulk-verificationStatistic.dto';
import { BulkVerificationWrapperDto } from './dto/bulk-verificationWrapper.dto';
import { BulkUploadDto} from './dto/bulk-upload.dto';

@Resolver('bulk-verification')
export class BulkVerificationResolver {
    constructor(
        private bulkVerificationService: BulkVerificationService
      ) {}

    //THIS METHOD IS USED TO FETCH ALL THE BULK RECORDS.
    @Query()
    async findAllBulkVerifications(@Args('page') page: number, @Args('limit') limit: number, @Args() { status, search, baseuserid }: BulkVerificationDto,) {
        const data = { status, search, baseuserid };
        return await this.bulkVerificationService.bulkVerifications(page, limit, data);
    }

    //THIS METHOD IS USED TO FETCH ALL THE TRANSACTIONS WHICH BELOGS TO A PARTICULAR BULK JOB.
    @Query()
    async findAllBulkWiseTransactions(@Args('page') page: number, @Args('limit') limit: number, @Args() { search, bulkId, baseuserid, invocationStatus, verificationStatus }: BulkVerificationTransactionDto,) {
        const data = {search, bulkId, baseuserid, invocationStatus, verificationStatus};
        return await this.bulkVerificationService.bulkWiseTransactions(page, limit, data);
    }

    //THIS METHOD IS USED TO FETCH THE STATISTICS FOR THE TRANSACTIONS.
    @Query()
    async findAllBulktransactionStatistics(@Args() { bulkId }: BulkVerificationStatisticDto,) {
        const data = {bulkId};
        return await this.bulkVerificationService.bulkTransactionStatistics(data);
    }

    //THIS METHOD IS USED TO FETCH THE WRAPPER SERVICE'S WHICH ALLOWS BULK UPLOAD.
    @Query()
    async getAllBulkWrapperService(@Args() { baseuserid }: BulkVerificationWrapperDto,) {
        const data = { baseuserid };
        return await this.bulkVerificationService.wrapperServiceForBulk(data);
    }

    @Query()
    async verifyBulkUpload(@Args() { base64,wrapperFk,baseuserid }: BulkUploadDto,) {
        const data = {base64,wrapperFk,baseuserid};
        return await this.bulkVerificationService.verifyBulkUpload(data);
    }
}