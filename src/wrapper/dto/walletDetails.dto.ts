import { IsNotEmpty, IsString, IsBoolean, IsNumber, isNumber, isBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WalletDetailsDto {
    @ApiProperty()
    @IsString()
    baseuserid?: string;
}