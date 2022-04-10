import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class SmallCards {
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

export class BigCards { 
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

export class PieChart { 
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

export class ProgressCharts { 
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

    @IsString()
    chartLabel: string;

    @IsString()
    link: string;

    @IsBoolean()
    isShowProgress: any;
}

export class DashboardRequest {
    smallCards: SmallCards[];
    bigCards: BigCards[];
    barChart: BarChart[];
    pieChart: PieChart[];
    progressCharts: ProgressCharts[];
}

export class DashboardDto {
    dashboardRequest: DashboardRequest;

    @IsString()
    baseuserid: string;
}
