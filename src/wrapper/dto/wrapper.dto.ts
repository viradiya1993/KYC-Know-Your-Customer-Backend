import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

import { Clientkeys } from '../../entity/clientkeys.entity';
import { WrapperServiceProviders } from '../../entity/wrapperServiceProviders.entity';


export class WrapperDto {
  
  pk: string;

  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  charge: string;

  @IsNotEmpty()
  @IsString()
  failureBaseCharge: string;

  @IsString()
  lastInvocation: Date;

  @IsBoolean()
  published: boolean;

  @IsNotEmpty()
  @IsString()
  successBaseCharge: string;

  @IsNotEmpty()
  @IsString()
  wrapperRef: string;

  @IsString()
  apiDocUrl: string;

  @ApiProperty()
  @IsString()
  baseuserid?: string;

  clientkeys?: Clientkeys[];

  wrapperServiceProviders?: WrapperServiceProviders[];
  
  @ApiProperty()
  @IsNumber()
  verificationServiceProviderId?: Array<string>;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  serviceType: string;
}


