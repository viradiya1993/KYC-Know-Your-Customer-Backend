import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
export class BulkVerificationStatisticDto {

  @ApiProperty()
  @IsNumber()
  bulkId?: number;

}


