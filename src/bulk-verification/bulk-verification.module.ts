import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BulkVerificationController } from './bulk-verification.controller';
import { BulkVerificationService } from './bulk-verification.service';
import { BulkVerificationResolver } from './bulk-verification.resolver';

import { BulkVerifications } from './../entity/bulkverifications.entity';
import { Settings } from '../entity/settings.entity';
import { User } from '../entity/user.entity';
@Module({
  controllers: [BulkVerificationController],
  providers: [BulkVerificationService, BulkVerificationResolver],
  imports:[TypeOrmModule.forFeature([BulkVerifications, Settings, User])]
})
export class BulkVerificationModule {}
