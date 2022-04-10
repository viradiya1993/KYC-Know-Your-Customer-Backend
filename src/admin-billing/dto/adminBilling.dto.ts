import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class AdminBillingDto {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  baseuserid?: string;
}