import { Args, Query, Resolver } from '@nestjs/graphql';
import { AdminBillingService } from './admin-billing.service';
import { AdminBillingDto} from './dto/adminBilling.dto';
import { BandDetailsDto } from './dto/bandDetails.dto';
import { saveBandDetailsDto } from './dto/saveBandDetails.dto';

@Resolver('admin-billing')
export class AdminBillingResolver {
    constructor(
        private adminBillingService: AdminBillingService
      ) {}

    //THIS METHOD IS USED TO FETCH ALL THE CUSTOMERS.
    @Query()
    async getCustomerDetails() {
        return await this.adminBillingService.getCustomerDetails();
    }

    //THIS METHOD IS USED TO FETCH ALL THE CUSTOMERS AND BANDS.
    @Query()
    async getBandAndCustomerDetails(@Args() { wrapperid }: BandDetailsDto) {
        const data = { wrapperid }; 
        return await this.adminBillingService.getBandAndCustomerDetails(data);
    }

    //THIS METHOD IS USED TO SAVE BAND DETAILS
    @Query()
    async saveBandDetails(@Args() { client_pk,band_pk,band_order,wrapper_service_provider_fk }: saveBandDetailsDto) {
        const data = { client_pk,band_pk,band_order,wrapper_service_provider_fk }; 
        return await this.adminBillingService.saveBandDetails(data);
    }

}