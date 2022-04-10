import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator, HealthCheck, DiskHealthIndicator  } from '@nestjs/terminus';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Default')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private dk: DiskHealthIndicator,
    ) {}

  @Get('testPing')
  @ApiOperation({ summary: 'Test the backend service by simple ping' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @HealthCheck()
  @ApiOperation({ summary: 'Health checker to test the database connection and typeorm' })
  readiness() {
    return this.health.check([
      async () => this.db.pingCheck('database', { timeout: 3000 }),
      async () => this.db.pingCheck('typeorm'),
      
    ]);
  }
}