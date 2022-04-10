import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
export class BulkVerificationTransactionDto {
  
  @ApiProperty()
  @IsString()
  search: string;

  @ApiProperty()
  @IsString()
  baseuserid?: string;

  @ApiProperty()
  @IsNumber()
  bulkId?: number;

  @ApiProperty()
  @IsString()
  invocationStatus: string;

  @ApiProperty()
  @IsString()
  verificationStatus: string;

}


