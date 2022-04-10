import { Args, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionWrapperDto } from './dto/transactionWrapper.dto';

@Resolver('transaction')
export class TransactionResolver {
    constructor(
        private transactionService: TransactionService
      ) {}

     @Query()
     async getAllTransactionHistory(@Args('page') page: number, @Args('limit') limit: number,@Args() { baseuserid, transactionStatus, verificationStatus, transactionType, serviceUsed, fromDate, toDate, search,mode }: TransactionDto) {
        const data = { baseuserid, transactionStatus, verificationStatus, transactionType, serviceUsed, fromDate, toDate, search, mode}; 
        return await this.transactionService.getAllTransactionHistory(page, limit, data);
     }

     @Query()
    async getAllWrapperService(@Args() { baseuserid }: TransactionWrapperDto) {
      const data = { baseuserid }; 
        return await this.transactionService.getAllWrapperService(data);
    }
}
