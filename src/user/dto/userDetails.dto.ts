import { IsNotEmpty, IsString, IsBoolean, IsNumber, isNumber, isBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDetailDto {
    @ApiProperty()
    @IsString()
    baseuserid?: string;

    @ApiProperty()
    @IsString()
    firstName?: string;

    @ApiProperty()
    @IsString()
    lastName?: string;

    @ApiProperty()
    @IsString()
    phoneno?: string;

    @ApiProperty()
    @IsBoolean()
    email_consent?: boolean;

    @ApiProperty()
    @IsBoolean()
    promotion_consent?: boolean;
}