import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class BulkVerificationDto {
  
  @ApiProperty()
  @IsString()
  search: string;

  @ApiProperty()
  @IsString()
  baseuserid?: string;

  @ApiProperty()
  @IsString()
  status: string;
}


