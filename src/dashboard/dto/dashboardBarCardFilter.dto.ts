import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class BarChart { 
    @IsString()
    aggregateFn: string;

    @IsString()
    inclusiveTable: string;

    @IsString()
    inclusiveColumn: string;

    @IsBoolean()
    active: boolean;

    @IsString()
    label: string;

    @IsString()
    logo: string;
    
    menuItems: [];

    @IsString()
    query: string;
}

export class DashboardRequest {
    barChart: BarChart[];
}

export class DashboardBarCardFilterDto {
    dashboardRequest: DashboardRequest;

    @ApiProperty()
    @IsString()
    dashboardRef?: string;

    @ApiProperty()
    @IsString()
    baseuserid: string;

    @ApiProperty()
    @IsString()
    filterByYear: string;
}
