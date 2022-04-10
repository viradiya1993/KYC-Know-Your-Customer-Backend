import { IsNotEmpty, IsString, IsBoolean, IsNumber, isNumber, isBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClientDetailDto {
    @ApiProperty()
    @IsString()
    orgId?: string;

    @ApiProperty()
    @IsString()
    website?: string;

    @ApiProperty()
    @IsString()
    email?: string;

    @ApiProperty()
    @IsString()
    industry?: string;

    @ApiProperty()
    @IsString()
    address?: string;

    @ApiProperty()
    @IsNumber()
    dateOfRegistration: number;

    @ApiProperty()
    @IsString()
    postalCode?: string;

    @ApiProperty()
    @IsString()
    name?: string;

    @ApiProperty()
    @IsString()
    phoneNumber?: string;

}