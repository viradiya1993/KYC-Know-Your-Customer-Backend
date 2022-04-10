import {
  Controller,
  Post,
  Logger,
  Body,
  Query,
  Response,
  Headers,
  Request
} from '@nestjs/common';

import { BulkVerificationService } from './bulk-verification.service';

import { BulkVerificationDto } from './dto/bulk-verification.dto';
import { BulkVerificationTransactionDto } from './dto/bulk-verificationTransaction.dto';
import { BulkVerificationStatisticDto } from './dto/bulk-verificationStatistic.dto';
import { BulkVerificationWrapperDto } from './dto/bulk-verificationWrapper.dto';
import { TemplateDownloadDto } from './dto/templateDownload.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import * as AWS from 'aws-sdk';
import { Settings } from '../entity/settings.entity';
import * as XLSX from 'xlsx';
import { Wrapper } from '../entity/wrapper.entity';
import { getConnectionManager } from 'typeorm';
import { BulkUploadDto } from './dto/bulk-upload.dto'
const excelToJson = require('convert-excel-to-json');
@ApiTags('Bulk verification services')
@Controller('bulk-verification')
export class BulkVerificationController {
  logger = new Logger('BulkVerificationController');
  constructor(private readonly bulkVerificationService: BulkVerificationService) {}

  //THIS METHOD IS USED TO FETCH ALL THE BULK RECORDS.
  @ApiOperation({ summary: 'Get all bulk verification records' })
  @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
  @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
  @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
  @ApiHeader({name: 'email', description: 'loggedIn user email'})
  @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
  @ApiResponse({ status: 201, description: 'Success'})
  @ApiResponse({ status: 403, description: 'Forbidden resource.'})
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @Post()
  async getBulkVerification(@Query('page') page: number, @Query('limit') limit: number,  @Body() body: BulkVerificationDto, @Request() req: any) {
      const bulkVerificationData = await this.bulkVerificationService.bulkVerifications( page, limit, body );
      return { 
        bulkVerificationData, 
        email: req.authDetails.userDetails.email,
        userId: req.authDetails.userDetails.id,
        code: 0, 
        description: 'Bulk verified services'};
  }

  //THIS METHOD IS USED TO FETCH ALL THE TRANSACTIONS WHICH BELOGS TO A PARTICULAR BULK JOB.
  @ApiOperation({ summary: 'Get all transactions belongs to particular bulk job' })
  @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
  @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
  @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
  @ApiHeader({name: 'email', description: 'loggedIn user email'})
  @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
  @ApiResponse({ status: 201, description: 'Success'})
  @ApiResponse({ status: 403, description: 'Forbidden resource.'})
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @Post('bulkWiseTransaction')
  async getBulkWiseTransactions(@Query('page') page: number, @Query('limit') limit: number, @Body() body: BulkVerificationTransactionDto, @Request() req: any) {
      const bulkWiseTransaction = await this.bulkVerificationService.bulkWiseTransactions( page, limit, body );
      return { 
        bulkWiseTransaction, 
        email: req.authDetails.userDetails.email,
        userId: req.authDetails.userDetails.id,
        code: 0, 
        description: 'Bulk wise transaction histroy'};
  }

  //THIS METHOD IS USED TO FETCH THE STATISTICS FOR THE TRANSACTIONS.
  @ApiOperation({ summary: 'Get statistics' })
  @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
  @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
  @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
  @ApiHeader({name: 'email', description: 'loggedIn user email'})
  @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
  @ApiResponse({ status: 201, description: 'Success'})
  @ApiResponse({ status: 403, description: 'Forbidden resource.'})
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @Post('transactionStatistics')
  async getBulktransactionStatistics(@Body() body: BulkVerificationStatisticDto, @Request() req: any) {
      const bulkWiseTransaction = await this.bulkVerificationService.bulkTransactionStatistics( body );
      return { 
        bulkWiseTransaction, 
        email: req.authDetails.userDetails.email,
        userId: req.authDetails.userDetails.id,
        code: 0, 
        description: 'Transaction statistics'
      };
  }

  //THIS METHOD IS USED TO FETCH THE WRAPPER SERVICE'S WHICH ALLOWS BULK UPLOAD.
  @ApiOperation({ summary: 'Get wrapper services which allow bulk upload' })
  @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
  @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
  @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
  @ApiHeader({name: 'email', description: 'loggedIn user email'})
  @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
  @ApiResponse({ status: 201, description: 'Success'})
  @ApiResponse({ status: 403, description: 'Forbidden resource.'})
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @Post('bulkWrapperService')
  async getWrapperServiceForBulk(@Body() body: BulkVerificationWrapperDto, @Request() req: any) {
      const wrapperService = await this.bulkVerificationService.wrapperServiceForBulk(body);
      return { 
        wrapperService, 
        email: req.authDetails.userDetails.email,
        userId: req.authDetails.userDetails.id,
        code: 0, 
        description: 'Wrapper services which allow bulk upload'};
  }


  @Post('S3Download')
  async downloadS3File(@Response() res,@Body() body: TemplateDownloadDto) {
    //This will fetch data from settings table.
    const connection = getConnectionManager().get();
    let s3AccessKey = await connection.getRepository(Settings).findOne({ name: "TATVA S3 ACCESS KEY" });
    let s3SecretKey = await connection.getRepository(Settings).findOne({ name: "TATVA S3 SECRET KEY" });
    let FileName = await connection.getRepository(Wrapper).findOne({ pk: body.wrapperPk.toString() });
    const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

    //This will update data in AWS config.
    AWS.config.update({
      accessKeyId: s3AccessKey.value,
      secretAccessKey: s3SecretKey.value,
      region: process.env.REGION
    });

    var fileParams = {
      Bucket: BUCKET_NAME,
      Key: process.env.BULKVERIFICATION_FOLDER_NAME + FileName.bulk_template_link
    }

    function getBufferFromS3(callback) {
      const buffers = [];
      const s3 = new AWS.S3();
      const stream = s3.getObject(fileParams).createReadStream();
      stream.on('data', data => buffers.push(data));
      stream.on('end', () => callback(null, Buffer.concat(buffers)));
      stream.on('error', error => callback(error));
    }

    // promisify read stream from s3
    function getBufferFromS3Promise() {
      return new Promise((resolve, reject) => {
        getBufferFromS3((error, s3buffer) => {
          if (error) return reject(error);
          return resolve(s3buffer);
        });
      });
    };

    // create workbook from buffer
     const buffer = await getBufferFromS3Promise();
     const workbook = XLSX.read(buffer);
     const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const base64Data = Buffer.from(wbout).toString('base64');
    res.send({'base64':base64Data})
  }

  @ApiOperation({ summary: 'Bulk-Upload Functionality' })
  @ApiHeader({name: 'product_id', description: 'loggedIn user productId'})
  @ApiHeader({name: 'authToken', description: 'loggedIn user authToken'})
  @ApiHeader({name: 'baseuserid', description: 'loggedIn baseuserid'})
  @ApiHeader({name: 'email', description: 'loggedIn user email'})
  @ApiHeader({name: 'expected_privileges', description: 'loggedIn user privileges'})
  @ApiResponse({ status: 201, description: 'Success'})
  @ApiResponse({ status: 403, description: 'Forbidden resource.'})
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @Post('verify-bulk-records')
  async bulkUploadExcelFile(@Body() body: BulkUploadDto, @Request() req: any){
    const bulkUpload = await this.bulkVerificationService.verifyBulkUpload( body );
    return { 
      bulkUpload, 
      email: req.authDetails.userDetails.email,
      userId: req.authDetails.userDetails.id, 
      code: 0, 
      description: 'Bulk upload successfully'};
  }
}