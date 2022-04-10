import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

import { Invocations } from '../entity/invocations.entity';
import { Client } from  '../entity/client.entity';
import { User } from '../entity/user.entity';
import { Settings } from '../entity/settings.entity';
import { CustomerBands } from '../entity/customerBand.entity';
import { VerificationServiceProvider } from '../entity/verificationserviceprovider.entity';
import { Band } from '../entity/band.entity';
@Module({
  controllers: [BillingController],
  providers: [BillingService],
  imports:[TypeOrmModule.forFeature([Invocations, Client, User, Settings, CustomerBands, VerificationServiceProvider, Band])]
})
export class BillingModule {}
