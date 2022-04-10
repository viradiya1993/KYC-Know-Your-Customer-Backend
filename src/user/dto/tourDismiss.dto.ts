import { IsNotEmpty, IsString, IsBoolean, IsNumber, isNumber, isBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class tourDismissDto {
    @ApiProperty()
    @IsString()
    baseuserid?: string;
}