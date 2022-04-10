import { Args, Query, Resolver } from '@nestjs/graphql'
import { BillingService } from './billing.service';
import { BillingDto } from './dto/billing.dto';
import { CustomerBillingDetailsDto } from './dto/customerBillingDetails.dto';
import { CustomerBillingBandDetailsDto } from './dto/customerBillingBandDetailsDto.dto';

@Resolver('billing')
export class BillingResolver {
    constructor(
        private billingService: BillingService
      ) {}

     @Query()
     async getBillingCards(@Args() { baseuserid }: BillingDto) {
        const data = { baseuserid }; 
        return await this.billingService.getBillingCards(data);
     }

     @Query()
     async getCustomerBillingDetails(@Args('page') page: number, @Args('limit') limit: number, @Args() { baseuserid, serviceType, wrapperId }: CustomerBillingDetailsDto) {
        const data = { baseuserid, serviceType, wrapperId }; 
        return await this.billingService.getCustomerBillingDetails(page, limit, data);
     }

     @Query()
     async getCustomerBillingBandDetails(@Args() { wrapperid, baseuserid, band_pk }: CustomerBillingBandDetailsDto) {
        const data = { wrapperid, baseuserid, band_pk }; 
        return await this.billingService.getCustomerBillingBandDetails(data);
     }

     @Query()
     async getWrapperService(@Args() { baseuserid }: BillingDto){
      const data = { baseuserid }; 
      return await this.billingService.getWrapperService(data);
     }
}