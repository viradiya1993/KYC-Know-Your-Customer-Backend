import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

import { User } from '../entity/user.entity';
import { Client } from  '../entity/client.entity';
import { ClientProfile } from '../entity/clientProfile.entity';
import { ClientUser } from '../entity/clientUser.entity';
import { Settings } from '../entity/settings.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, UserResolver],
  imports:[TypeOrmModule.forFeature([User, Client, ClientProfile, ClientUser, Settings]),
   ]
})
export class UserModule {}
