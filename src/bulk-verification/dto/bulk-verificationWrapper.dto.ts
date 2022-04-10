import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
export class BulkVerificationWrapperDto {

  @ApiProperty()
  @IsString()
  baseuserid?: string;

}


