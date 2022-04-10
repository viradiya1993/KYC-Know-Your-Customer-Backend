import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WrapperController } from './wrapper.controller';
import { WrapperService } from './wrapper.service';
import { WrapperResolver } from './wrapper.resolver';

import { Wrapper } from '../entity/wrapper.entity';
import { VerificationServiceProvider } from '../entity/verificationserviceprovider.entity';
import { Clientkeys } from '../entity/clientkeys.entity';
import { Settings } from '../entity/settings.entity';
import { User } from '../entity/user.entity';
@Module({
  controllers: [WrapperController],
  providers: [WrapperService, WrapperResolver],
  imports: [TypeOrmModule.forFeature([Wrapper, VerificationServiceProvider, Clientkeys, Settings, User])]
})
export class WrapperModule { }
