import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CustomerBillingBandDetailsDto {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  wrapperid?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  baseuserid?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  band_pk?: string;
}
