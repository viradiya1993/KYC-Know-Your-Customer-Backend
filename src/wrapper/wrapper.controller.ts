import {
    Controller,
    Post,
    Get,
    Logger,
    Body,
    Query,
    Request
  } from '@nestjs/common';

import { WrapperDto } from './dto/wrapper.dto';

import { WrapperService } from './wrapper.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { WrapperListDto } from './dto/wrapperList.dto';
import { WalletDto } from './dto/wallet.dto';
@ApiTags('Wrapper services')
@Controller('wrapper')
export class WrapperController {
    logger = new Logger('WrapperController');
    constructor(private readonly wrapperService: WrapperService) {}
    
    //THIS METHOD IS USED TO FETCH THE WRAPPER SERVICE'S.
    @ApiOperation({ summary: 'Get all wrapper services' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post()
    async findAllWrapper(@Query('page') page: number, @Query('limit') limit: number, @Body() body: Partial<WrapperDto>, @Request() req: any) {
        const wrapperdetails = await this.wrapperService.getAllWrapper( page, limit, body );
        return { 
            services: wrapperdetails.wrappers[0], 
            totalCount: wrapperdetails.wrappers[1], 
            activation_status: wrapperdetails.verifiedStatus[0]["activationStatus"],
            email: req.authDetails.userDetails.email,
            baseuserid: req.authDetails.userDetails.id,
            userid: wrapperdetails.userid,
            code: 0, 
            description: 'All wrapper services'
        };
    }

    //THIS METHOD IS USED TO FETCH THE WRAPPER VERIFIED SERVICE'S.
    @ApiOperation({ summary: 'Get all wrapper verified services' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Get('verificationservice')
    async getAllVerificationService(@Request() req: any){
        const verificationservice = await this.wrapperService.getAllVerificationService();
        return { 
            verificationservice, 
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'All wrapper verified services' 
        };
    }

    //THIS METHOD IS USED TO UPDATE IS_LIVE COLUMN IN CLIENTKEY TABLE ON CHANGE OF LIST TEST TOGGLE BUTTON.
    @ApiOperation({ summary: 'Update is_Live column on change of toggle button.' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post('updateLiveTestValue')
    async updateClietKeyLiveTest(@Body() body: WrapperListDto, @Request() req: any) {
        const testLiveData = await this.wrapperService.updateClietKeyLiveTest( body );
        return { 
            testLiveData, 
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'Update successfully' 
        };
    }

    //THIS METHOD IS USED TO CREATE WALLET IF NOT EXIST.
    @ApiOperation({ summary: 'Create wallet if it does not exist.' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post('createWallet')
    async createWallet(@Body() body: WalletDto, @Request() req: any) {
        const walletData = await this.wrapperService.createWallet( body );
        if (walletData == null){
            return { 
                walletData, 
                email: req.authDetails.userDetails.email,
                userId: req.authDetails.userDetails.id,
                code: 0, 
                description: 'Wallet not created'
            };
        }
        else{
            return { 
                walletData, 
                email: req.authDetails.userDetails.email,
                userId: req.authDetails.userDetails.id,
                code: 0, 
                description: 'Wallet created successfully'
            };
        }
    }

    //THIS METHOD IS USED TO FETCH WALLET DETAILS.
    @ApiOperation({ summary: 'Fetch wallet details.' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post('walletDetails')
    async walletDetails(@Body() body: WalletDto, @Request() req: any) {
        const walletDetails = await this.wrapperService.walletDetails( body );
        return { 
            walletDetails, 
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'Fetch all wallet details.' 
        };
    }


}