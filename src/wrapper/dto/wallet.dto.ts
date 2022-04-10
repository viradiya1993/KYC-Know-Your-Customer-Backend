import { IsNotEmpty, IsString, IsBoolean, IsNumber, isNumber, isBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WalletDto {
    @ApiProperty()
    @IsString()
    baseuserid: string;

    @ApiProperty()
    @IsString()
    baseOrg: string;

    @ApiProperty()
    @IsString()
    baseProduct: string;

    @ApiProperty()
    @IsString()
    baseProductUserCategoryCode: string;

    @ApiProperty()
    @IsString()
    baseProductUserCategoryId: string;
}