import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
export class TemplateDownloadDto {
  
  @ApiProperty()
  @IsNumber()
  wrapperPk?: number;
}


