import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

import { TransactionResolver } from './transaction.resolver';

import { Invocations } from '../entity/invocations.entity';
import { Settings } from '../entity/settings.entity';
import { User } from '../entity/user.entity';
@Module({
  controllers: [TransactionController],
  providers: [TransactionService, TransactionResolver],
  imports:[TypeOrmModule.forFeature([Invocations, Settings, User])]
})
export class TransactionModule {}
