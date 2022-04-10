import { Body, Controller, Logger, Post, Request } from '@nestjs/common';
import { ApiOperation, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

import * as AWS from 'aws-sdk';
import { Settings } from '../entity/settings.entity';
import { RequestResponsePayloadDto } from '../dashboard/dto/requestResponsePayload.dto';
import { DashboardBarCardFilterDto} from '../dashboard/dto/dashboardBarCardFilter.dto';
import { DashboardUserActionDto } from '../dashboard/dto/checkUserAction.dto';
import { getConnectionManager } from 'typeorm';
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
    logger = new Logger('WrapperController');
    constructor(private readonly dashboardService: DashboardService) { }

    //THIS METHOD IS USED FOR DASHBOARD CARDS.
    @ApiOperation({ summary: 'Get cards details' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post('cards')
    async downloadFiel(@Body() body: RequestResponsePayloadDto, @Request() req: any) {
        const connection = getConnectionManager().get();
        let s3AccessKey = await connection.getRepository(Settings).findOne({ name: "TATVA S3 ACCESS KEY" });
        let s3SecretKey = await connection.getRepository(Settings).findOne({ name: "TATVA S3 SECRET KEY" });
        const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
        const s3 = new AWS.S3();
        //This will update data in AWS config.
        AWS.config.update({
            accessKeyId: s3AccessKey.value,
            secretAccessKey: s3SecretKey.value,
            region: process.env.REGION
        });

        const requestFile = await s3.getObject({ Bucket: BUCKET_NAME, Key: process.env.DASHBOARD_FOLDER_NAME + body.dashboardRef + ".json" }).promise()
        let requestData = JSON.parse(requestFile.Body.toString('utf-8'))
        const dashboardCardDetails = await this.dashboardService.createDashboardCards( requestData, body.baseuserid );
        return { 
            dashboardResponse: dashboardCardDetails,
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'Get cards details successfully'
        };
    }

    //THIS METHOD IS USED FOR DASHBOARD BAR CARD FILTER.
    @ApiOperation({ summary: 'Bar card filter' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post('barcard/filter')
    async downloadFielForFilter(@Body() body: DashboardBarCardFilterDto, @Request() req: any) {
        const connection = getConnectionManager().get();
        let s3AccessKey = await connection.getRepository(Settings).findOne({ name: "TATVA S3 ACCESS KEY" });
        let s3SecretKey = await connection.getRepository(Settings).findOne({ name: "TATVA S3 SECRET KEY" });
        const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
        const s3 = new AWS.S3();
        //This will update data in AWS config.
        AWS.config.update({
            accessKeyId: s3AccessKey.value,
            secretAccessKey: s3SecretKey.value,
            region: process.env.REGION
        });

        const requestFile = await s3.getObject({ Bucket: BUCKET_NAME, Key: process.env.DASHBOARD_FOLDER_NAME + body.dashboardRef + ".json" }).promise()
        let requestData = JSON.parse(requestFile.Body.toString('utf-8'))
        const dashboardCardDetails = await this.dashboardService.filterBarCard( requestData, body.baseuserid, body.filterByYear );
        return { 
            dashboardResponse: dashboardCardDetails,
            email: req.authDetails.userDetails.email,
            userId: req.authDetails.userDetails.id,
            code: 0, 
            description: 'Get bar card filter details successfully'
        };
    }


    //THIS METHOD IS USED FOR NEW USER DASHBOARD CHECK ACTIONS.
    @ApiOperation({ summary: 'Check new user dashboard actions' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post('checkuserAction')
    async checkUserAction(@Body() body: DashboardUserActionDto, @Request() req: any) {
        const checkuserActions = await this.dashboardService.checkUserAction( body, req.authDetails.auth );
        return { 
            userActions: checkuserActions.userActions, 
            // clientKeys_details: checkuserActions.clientKeys_details,
            userid: checkuserActions.userid,
            adminApiKey: checkuserActions.apiKey,
            adminUserId: checkuserActions.userId,
            email: req.authDetails.userDetails.email, 
            baseuserid: req.authDetails.userDetails.id, 
            code: 0, 
            description: 'Get user actions successfully'
        };
    }
}
