import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

import { LoggingInterceptor } from './shared/logging.interceptor';
import { HttpErrorFilter } from './shared/http-error.filter';
import { TerminusModule } from '@nestjs/terminus';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';

import { WrapperModule } from './wrapper/wrapper.module';
import { TransactionModule } from './transaction/transaction.module';
import { BulkVerificationModule } from './bulk-verification/bulk-verification.module';
import { UserModule } from './user/user.module';
import { BillingModule } from './billing/billing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthorizationMiddleware } from './shared/authorization.middleware';

import { BillingController } from './billing/billing.controller';
import { BulkVerificationController } from './bulk-verification/bulk-verification.controller';
import { DashboardController } from './dashboard/dashboard.controller';
import { TransactionController } from './transaction/transaction.controller';
import { WrapperController } from './wrapper/wrapper.controller';
import { AdminBillingModule } from './admin-billing/admin-billing.module';
import { AdminBillingController } from './admin-billing/admin-billing.controller';

@Module({
  imports: [
    TerminusModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req, res, connection, payload }) => {
        if (req) {
          return { headers: req.headers };
        }
      },
      installSubscriptionHandlers: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql.schema.ts'),
        outputAs: 'class',
      },
    }),
    WrapperModule,
    TransactionModule,
    BulkVerificationModule,
    UserModule,
    BillingModule,
    DashboardModule,
    AdminBillingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(userContext: MiddlewareConsumer) {
    userContext
      .apply(AuthorizationMiddleware)
      .forRoutes(
        BillingController,
        BulkVerificationController,
        DashboardController,
        TransactionController,
        WrapperController,
        AdminBillingController,
        { path: '/verified/kyc/userDetails', method: RequestMethod.POST },
        { path: '/verified/kyc/user/update', method: RequestMethod.POST },
        { path: '/verified/kyc/client/update', method: RequestMethod.POST },
        { path: '/verified/kyc/user/tourDismiss', method: RequestMethod.POST }
      );
  }
}
