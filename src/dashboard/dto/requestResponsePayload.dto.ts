import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class RequestResponsePayloadDto {
  
  @ApiProperty()
  @IsString()
  dashboardRef?: string;

  @ApiProperty()
  @IsString()
  baseuserid?: string;
 
}