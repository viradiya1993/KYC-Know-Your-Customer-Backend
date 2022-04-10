import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class BillingDto {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  baseuserid?: string;

}


