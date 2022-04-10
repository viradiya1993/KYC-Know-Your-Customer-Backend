import { Args, Query, Resolver } from '@nestjs/graphql';
import { WrapperService } from './wrapper.service';
import { WrapperDto } from './dto/wrapper.dto';
import { WrapperListDto } from './dto/wrapperList.dto';
import { WalletDto } from './dto/wallet.dto';
import { WalletDetailsDto } from './dto/walletDetails.dto';

@Resolver('wrapper')
export class WrapperResolver {
    constructor(
        private wrapperService: WrapperService
      ) {}

    @Query()
    async findAllWrapper(@Args('page') page: number, @Args('limit') limit: number, @Args() { name, serviceType, baseuserid, verificationServiceProviderId }: WrapperDto,) {
        const data = { name, serviceType , baseuserid, verificationServiceProviderId };
        return await this.wrapperService.getAllWrapper(page, limit, data);
    }

    @Query()
    async getAllVerificationService() {
        return await this.wrapperService.getAllVerificationService();
    }

    @Query()
    async updateClietKeyLiveTest(@Args() { pk,wrapperfk,baseuserid,is_live }: WrapperListDto) {
        const data = { pk,wrapperfk,baseuserid,is_live };
        return await this.wrapperService.updateClietKeyLiveTest(data);
    }

    @Query()
    async createWallet(@Args() { baseuserid,baseOrg,baseProduct,baseProductUserCategoryId,baseProductUserCategoryCode }: WalletDto) {
        const data = { baseuserid,baseOrg,baseProduct,baseProductUserCategoryId,baseProductUserCategoryCode};
        return await this.wrapperService.createWallet(data);
    }

    @Query()
    async walletDetails(@Args() { baseuserid }: WalletDetailsDto) {
        const data = { baseuserid };
        return await this.wrapperService.walletDetails(data);
    }
}
