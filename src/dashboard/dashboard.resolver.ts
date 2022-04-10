import { Args, Query, Resolver } from '@nestjs/graphql';

import { DashboardService } from './dashboard.service';
import { DashboardUserActionDto } from './dto/checkUserAction.dto';
import { DashboardDto } from './dto/dashboard.dto';
import { DashboardBarCardFilterDto } from './dto/dashboardBarCardFilter.dto';

@Resolver('dashboard')
export class DashboardResolver {
    constructor(
        private dashboardService: DashboardService
      ) {}

     @Query()
     async createDashboardCards(@Args() { dashboardRequest, baseuserid  }: DashboardDto) {
        const data = { dashboardRequest, baseuserid }; 
        return await this.dashboardService.createDashboardCards(data, baseuserid);
     }

     async filterBarCard(@Args() { dashboardRequest, baseuserid, filterByYear  }: DashboardBarCardFilterDto) {
      const data = { dashboardRequest, baseuserid, filterByYear }; 
      return await this.dashboardService.filterBarCard(data, baseuserid, filterByYear);
   }

   @Query()
   async checkUserAction(@Args() { baseuserid , baseOrg , baseProduct , baseProductUserCategoryCode , baseProductUserCategoryId  }: DashboardUserActionDto) {
      const data = { baseuserid,baseOrg,baseProduct,baseProductUserCategoryCode,baseProductUserCategoryId }; 
      return await this.dashboardService.createDashboardCards(data,'');
   }

     
}
