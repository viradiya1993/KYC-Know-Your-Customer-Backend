import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Wrapper } from '../entity/wrapper.entity';
import { Invocations } from '../entity/invocations.entity';
import { Settings } from '../entity/settings.entity';
import { User } from '../entity/user.entity';
@Module({
  controllers: [DashboardController],
  providers: [DashboardService,
    DashboardResolver
  ],
  imports: [TypeOrmModule.forFeature([Wrapper, Invocations, Settings, User])]
})
export class DashboardModule { }
