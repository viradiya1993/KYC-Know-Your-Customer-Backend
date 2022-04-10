import {
    Controller,
    Post,
    Logger,
    Body,
    Query,
    Request
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingDto } from './dto/billing.dto';
import { CustomerBillingDetailsDto } from './dto/customerBillingDetails.dto';
import { CustomerBillingBandDetailsDto } from './dto/customerBillingBandDetailsDto.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
@ApiTags('Billing services')
@Controller('/billing')
export class BillingController {
    logger = new Logger('BillingController');
    constructor(private readonly billingService: BillingService) { }

    //THIS METHOD IS USED TO FETCH THE DETAILS OF BILLING CARDS.
    @ApiOperation({ summary: 'Get billing cards details' })
    @ApiHeader({ name: 'product_id', description: 'loggedIn user productId' })
    @ApiHeader({ name: 'authToken', description: 'loggedIn user authToken' })
    @ApiHeader({ name: 'baseuserid', description: 'loggedIn baseuserid' })
    @ApiHeader({ name: 'email', description: 'loggedIn user email' })
    @ApiHeader({ name: 'expected_privileges', description: 'loggedIn user privileges' })
    @ApiResponse({ status: 201, description: 'Success' })
    @ApiResponse({ status: 403, description: 'Forbidden resource.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Post('cards')
    async getBillingCards(@Body() body: BillingDto, @Request() req: any) {
        const billingCardData = await this.billingService.getBillingCards(body);
        return {
            billingCardData,
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'Billing cards details'
        };
    }

    //THIS METHOD IS USED TO FETCH THE DETAILS OF BILLING CARDS.
    @ApiOperation({ summary: 'Get customer billing details' })
    @ApiHeader({ name: 'product_id', description: 'loggedIn user productId' })
    @ApiHeader({ name: 'authToken', description: 'loggedIn user authToken' })
    @ApiHeader({ name: 'baseuserid', description: 'loggedIn baseuserid' })
    @ApiHeader({ name: 'email', description: 'loggedIn user email' })
    @ApiHeader({ name: 'expected_privileges', description: 'loggedIn user privileges' })
    @ApiResponse({ status: 201, description: 'Success' })
    @ApiResponse({ status: 403, description: 'Forbidden resource.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Post('customerBillingDetails')
    async getCustomerBillingDetails(@Query('page') page: number, @Query('limit') limit: number, @Body() body: CustomerBillingDetailsDto, @Request() req: any) {
        const customerbilling = await this.billingService.getCustomerBillingDetails(page, limit, body);
        return {
            customerbilling: customerbilling.customer_billing_details,
            totalCount: customerbilling.totalCount,
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'Customer billing details'
        };
    }

    //THIS METHOD IS USED TO FETCH THE BANDS DETAILS OF BILLING.
    @ApiOperation({ summary: 'Get band details' })
    @ApiHeader({ name: 'product_id', description: 'loggedIn user productId' })
    @ApiHeader({ name: 'authToken', description: 'loggedIn user authToken' })
    @ApiHeader({ name: 'baseuserid', description: 'loggedIn baseuserid' })
    @ApiHeader({ name: 'email', description: 'loggedIn user email' })
    @ApiHeader({ name: 'expected_privileges', description: 'loggedIn user privileges' })
    @ApiResponse({ status: 201, description: 'Success' })
    @ApiResponse({ status: 403, description: 'Forbidden resource.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Post('billingBandDetails')
    async getCustomerBillingBandDetails(@Body() body: CustomerBillingBandDetailsDto, @Request() req: any) {
        const bandsDetails = await this.billingService.getCustomerBillingBandDetails(body);
        return {
            bandsDetails,
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'Billing band details'
        };
    }

    //THIS METHOD IS USED TO GET ALL WRAPPER SERVICES.
    @ApiOperation({ summary: 'Get all wrapper services' })
    @ApiHeader({ name: 'product_id', description: 'loggedIn user productId' })
    @ApiHeader({ name: 'authToken', description: 'loggedIn user authToken' })
    @ApiHeader({ name: 'baseuserid', description: 'loggedIn baseuserid' })
    @ApiHeader({ name: 'email', description: 'loggedIn user email' })
    @ApiHeader({ name: 'expected_privileges', description: 'loggedIn user privileges' })
    @ApiResponse({ status: 201, description: 'Success' })
    @ApiResponse({ status: 403, description: 'Forbidden resource.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Post('wrapperservice')
    async getAllWrapperService(@Body() body: BillingDto, @Request() req: any) {
        const wrapperService = await this.billingService.getWrapperService(body);
        return {
            wrapperService,
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'All wrapper services'
        };
    }
}