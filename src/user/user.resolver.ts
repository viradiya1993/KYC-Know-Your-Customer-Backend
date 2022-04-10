import {
    Resolver,
    Query,
    Args,
    ResolveProperty,
    Parent,
    Mutation,
    Context,
  } from '@nestjs/graphql';

import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UserDetailDto } from './dto/userDetails.dto';
import { ClientDetailDto } from './dto/clientDetails.dto';
import { tourDismissDto } from './dto/tourDismiss.dto';

@Resolver('signUp')
export class UserResolver {
    constructor(
        private userService: UserService
      ) {}

    @Query()
    async signUp(@Args() { 
        individualDetails, userType, organizationBaseId, userBaseId, userCategory,
        organizationDetails, superadmin }: UserDto) {
        const data = { individualDetails, userType, organizationBaseId, userBaseId, userCategory,
        organizationDetails, superadmin };
        return await this.userService.signUp(data);
    }

    @Query()
    async userDetails(@Args() { baseuserid }: UserDetailDto) {
        const data = { baseuserid };
        return await this.userService.userDetails(data);
    }

    @Query()
    async updateUser(@Args() { baseuserid, firstName, lastName, phoneno, email_consent, promotion_consent }: UserDetailDto) {
        const data = { baseuserid, firstName, lastName, phoneno, email_consent, promotion_consent };
        return await this.userService.updatedUser(data);
    }

    @Query()
    async updateClient(@Args() {orgId,website,email,industry,address,dateOfRegistration,postalCode,name,phoneNumber }: ClientDetailDto) {
        const data = { orgId,website,email,industry,address,dateOfRegistration,postalCode,name,phoneNumber };
        return await this.userService.updatedClient(data);
    }

    @Query()
    async updateTourDismiss(@Args() {baseuserid}: tourDismissDto) {
        const data = { baseuserid };
        return await this.userService.updateTourDismiss(data);
    }
}