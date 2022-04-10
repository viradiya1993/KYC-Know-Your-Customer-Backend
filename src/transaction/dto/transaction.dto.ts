import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
export class TransactionDto {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  baseuserid?: String;

  @ApiProperty()
  @IsString()
  transactionStatus: string;

  @ApiProperty()
  @IsString()
  verificationStatus: string;

  @ApiProperty()
  @IsString()
  transactionType: string;

  @ApiProperty()
  @IsString()
  serviceUsed: Array<string>;

  @ApiProperty()
  @IsString()
  fromDate: Date;

  @ApiProperty()
  @IsString()
  toDate: Date;

  @ApiProperty()
  @IsString()
  search: String;

  @ApiProperty()
  @IsString()
  mode: string;
}


