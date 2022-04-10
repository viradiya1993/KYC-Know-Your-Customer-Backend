import {
    Controller,
    Post,
    Logger,
    Body,
    Query,
    Response,
    Headers,
    Request,
    Get
  } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdminBillingService } from './admin-billing.service';
import { AdminBillingDto } from './dto/adminBilling.dto';
import { BandDetailsDto } from './dto/bandDetails.dto';
import { saveBandDetailsDto } from './dto/saveBandDetails.dto';

@ApiTags('Admin billing services')
@Controller('admin-billing')
export class AdminBillingController {
    logger = new Logger('AdminBillingController');
    constructor(private readonly adminBillingService: AdminBillingService) { }

    //THIS METHOD IS USED TO FETCH THE DETAILS OF ACTIVE CUSTOMERS.
    @ApiOperation({ summary: 'Get customer details' })
    @ApiHeader({ name: 'product_id', description: 'loggedIn user productId' })
    @ApiHeader({ name: 'authToken', description: 'loggedIn user authToken' })
    @ApiHeader({ name: 'baseuserid', description: 'loggedIn baseuserid' })
    @ApiHeader({ name: 'email', description: 'loggedIn user email' })
    @ApiHeader({ name: 'expected_privileges', description: 'loggedIn user privileges' })
    @ApiResponse({ status: 201, description: 'Success' })
    @ApiResponse({ status: 403, description: 'Forbidden resource.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get('customerDetails')
    async getCustomerDetails(@Request() req: any) {
        const customerData = await this.adminBillingService.getCustomerDetails();
        return {
            customerData,
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'All customer details'
        };
    }

    //THIS METHOD IS USED TO FETCH THE DETAILS OF BAND AND CUSTOMERS.
    @ApiOperation({ summary: 'Get band and customer details' })
    @ApiHeader({ name: 'product_id', description: 'loggedIn user productId' })
    @ApiHeader({ name: 'authToken', description: 'loggedIn user authToken' })
    @ApiHeader({ name: 'baseuserid', description: 'loggedIn baseuserid' })
    @ApiHeader({ name: 'email', description: 'loggedIn user email' })
    @ApiHeader({ name: 'expected_privileges', description: 'loggedIn user privileges' })
    @ApiResponse({ status: 201, description: 'Success' })
    @ApiResponse({ status: 403, description: 'Forbidden resource.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Post('customerbandDetails')
    async getBandAndCustomerDetails(@Body() body: BandDetailsDto,@Request() req: any) {
        const bandAndCustomerData = await this.adminBillingService.getBandAndCustomerDetails(body);
        return {
            bandAndCustomerData,
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'All customer and band details'
        };
    }

    //THIS METHOD IS USED TO SAVE BAND DEATILS.
    @ApiOperation({ summary: 'Save band details.' })
    @ApiHeader({ name: 'product_id', description: 'loggedIn user productId' })
    @ApiHeader({ name: 'authToken', description: 'loggedIn user authToken' })
    @ApiHeader({ name: 'baseuserid', description: 'loggedIn baseuserid' })
    @ApiHeader({ name: 'email', description: 'loggedIn user email' })
    @ApiHeader({ name: 'expected_privileges', description: 'loggedIn user privileges' })
    @ApiResponse({ status: 201, description: 'Success' })
    @ApiResponse({ status: 403, description: 'Forbidden resource.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Post('savebandDetails')
    async saveBandDetails(@Body() body: saveBandDetailsDto,@Request() req: any) {
        const bandDetails = await this.adminBillingService.saveBandDetails(body);
        return {
            bandDetails,
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'Band details saved successfully.'
        };
    }

}
