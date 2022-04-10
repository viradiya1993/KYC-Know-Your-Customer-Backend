import { WrapperDto } from './wrapper.dto';
import { IsNotEmpty, IsString, IsBoolean, IsNumber, isNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WrapperListDto {
  pk: string;

  @IsBoolean()
  is_live: boolean;

  @ApiProperty()
  @IsString()
  baseuserid?: string;

  @ApiProperty()
  @IsNumber()
  wrapperfk?: number;
}