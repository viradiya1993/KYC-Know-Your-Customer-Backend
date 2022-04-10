import {
    Controller,
    Post,
    Logger,
    Body,
    Get,
    Headers,
    Request
  } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserDetailDto } from './dto/userDetails.dto';
import { ClientDetailDto } from './dto/clientDetails.dto';
import { tourDismissDto } from './dto/tourDismiss.dto';
@ApiTags('User')
@Controller('/verified/kyc')
export class UserController {
    logger = new Logger('UserController');
    constructor(private readonly userService: UserService) {}

    //THIS METHOD IS USED FOR SIGNUP.
    @ApiOperation({ summary: 'signup service' })
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post()
    async signUp(@Body() body: UserDto) {
        const signUpData = await this.userService.signUp( body );
        return { data: signUpData, code: 0, description: 'User created successfully' };
    }

    //THIS METHOD IS USED TO LOGOUT USER AND CLEAR MAMCACHED.
    @ApiOperation({ summary: 'Logout user and clear mamcached' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Get('logout')
    async logout(@Headers() headers: any, @Request() req: any) {
        let cacheAuthTokenKey = headers.authtoken + "-" + headers.baseuserid;
        const logoutUser = await this.userService.logout(cacheAuthTokenKey);
        return { logoutUser, code: 0, description: 'Logout user successfully'};
    }

    //THIS METHOD IS USED TO FETCH WALLET DETAILS.
    @ApiOperation({ summary: 'Fetch user details.' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post('userDetails')
    async userDetails(@Body() body: UserDetailDto, @Request() req: any) {
        const userDetails = await this.userService.userDetails( body );
        return { 
            userDetails, 
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'Fetch user details.' 
        };
    }

    //THIS METHOD IS USED TO UPDATE USER DETAILS.
    @ApiOperation({ summary: 'Update user detials' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post('user/update')
    async updateUser(@Body() body: UserDetailDto, @Request() req: any) {
        const updatedUser = await this.userService.updatedUser( body );
        return {
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'Update successfully' 
        };
    }

    //THIS METHOD IS USED TO UPDATE CLIENT DETAILS.
    @ApiOperation({ summary: 'Update client detials' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post('client/update')
    async updateClient(@Body() body: ClientDetailDto, @Request() req: any) {
        const updatedUser = await this.userService.updatedClient( body );
        return {
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'Update successfully' 
        };
    }

    //THIS METHOD IS USED TO UPDATE CLIENT DETAILS.
    @ApiOperation({ summary: 'Update if user has dismissed the tour.' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post('user/tourDismiss')
    async updateTourDismiss(@Body() body: tourDismissDto, @Request() req: any) {
        const updatedUser = await this.userService.updateTourDismiss( body );
        return {
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'Update successfully' 
        };
    }
}
