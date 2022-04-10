import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
export class CustomerBillingDetailsDto {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  baseuserid?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  serviceType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  wrapperId: string;
}


