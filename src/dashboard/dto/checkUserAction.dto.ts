import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class DashboardUserActionDto {
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
