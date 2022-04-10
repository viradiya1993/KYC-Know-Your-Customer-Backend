import {
    Controller,
    Post,
    Logger,
    Body,
    Query,
    Request
  } from '@nestjs/common';

import { TransactionService } from './transaction.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TransactionDto } from './dto/transaction.dto';
import { TransactionWrapperDto } from './dto/transactionWrapper.dto';
import * as AWS from 'aws-sdk';
import { RequestResponsePayloadDto } from './dto/requestResponsePayload.dto';
import { getConnectionManager } from 'typeorm';
import { Settings } from '../entity/settings.entity';
@ApiTags('Transaction services')
@Controller('transaction')
export class TransactionController {
    logger = new Logger('TransactionController');
    constructor(private readonly transactionService: TransactionService) {}
    
    //THIS METHOD IS USED TO GET ALL TRANSACTION HISTORY.
    @ApiOperation({ summary: 'Get all transaction history' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post()
    async getAllTransactionHistory(@Query('page') page: number, @Query('limit') limit: number, @Body() body: TransactionDto, @Request() req: any) {
        const transactions = await this.transactionService.getAllTransactionHistory( page, limit, body);
        return { 
          transactions,
          email: req.authDetails.userDetails.email,
          userId: req.authDetails.userDetails.id,
          code: 0, 
          description: 'All transaction history'
        };
    }

    //THIS METHOD IS USED TO GET ALL WRAPPER SERVICES.
    @ApiOperation({ summary: 'Get all wrapper services' })
    @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
    @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
    @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
    @ApiHeader({name: 'email', description: 'loggedIn user email'})
    @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
    @ApiResponse({ status: 201, description: 'Success'})
    @ApiResponse({ status: 403, description: 'Forbidden resource.'})
    @ApiResponse({ status: 401, description: 'Unauthorized'})
    @Post('wrapperservice')
    async getAllVerificationService(@Body() body: TransactionWrapperDto, @Request() req: any){
        const transactionService = await this.transactionService.getAllWrapperService(body);
        return { 
          transactionService, 
          email: req.authDetails.userDetails.email,
          userId: req.authDetails.userDetails.id,
          code: 0, 
          description: 'All verification services'
        };
    }

    @Post('S3DownloadRequestResponse')
    async downloadFiel(@Body() body: RequestResponsePayloadDto) {
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
    
    const requestFile = await s3.getObject({ Bucket: BUCKET_NAME, Key: process.env.INVOCATION_FOLDER_NAME + body.transactionRef + "-RECEIVED.json" }).promise()
    let requestData =  JSON.parse(requestFile.Body.toString('utf-8'))

    const responseFile = await s3.getObject({ Bucket: BUCKET_NAME, Key: process.env.INVOCATION_FOLDER_NAME + body.transactionRef + "-PROCESSED.json" }).promise()
    let responseData =  JSON.parse(responseFile.Body.toString('utf-8'))

    return { 
      requestData : requestData,
      responseData : responseData
    }
  }
}