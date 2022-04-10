import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class saveBandDetailsDto {
  
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    client_pk?: bigint;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    band_pk?: bigint;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    band_order?: bigint;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    wrapper_service_provider_fk?: string;
}