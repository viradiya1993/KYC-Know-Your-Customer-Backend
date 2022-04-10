import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invocations } from '../entity/invocations.entity';
import { AdminBillingController } from './admin-billing.controller';
import { AdminBillingService } from './admin-billing.service';

@Module({
  controllers: [AdminBillingController],
  providers: [AdminBillingService],
  imports:[TypeOrmModule.forFeature([Invocations])]
})
export class AdminBillingModule {}
