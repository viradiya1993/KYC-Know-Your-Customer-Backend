import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
export class BulkUploadDto {
  
  @ApiProperty()
  @IsString()
  base64: string;

  @ApiProperty()
  @IsNumber()
  wrapperFk: number;

  @ApiProperty()
  @IsString()
  baseuserid?: string;

}


