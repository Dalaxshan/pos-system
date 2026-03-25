import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Module Imports
import { AdminModule } from './modules/admins/admin.module';
import { EmployeeModule } from './modules/employees/employee.module';
import { AuthModule } from './modules/auth/auth.module';
import { SupplierModule } from './modules/suppliers/supplier.module';
import { CustomerModule } from './modules/customers/customer.module';
import { FileUploadModule } from './common/file-upload/file-upload.module';
import { ItemModule } from './modules/items/item.module';
import { EmailModule } from './common/email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PurchaseModule } from './modules/purchases/purchase.module';
import { SalesModule } from './modules/sales/sales.module';
import { CategoryModule } from './modules/categories/category.module';
import { ConfigProps } from './configs/config.interface';
import { config } from './configs/config';
import { awsConfig } from './configs/aws.config';
import { smtpConfig } from './configs/smtp.config';
import { LoginHistoryModule } from './modules/login-history/login-history.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { BranchModule } from './modules/branches/branch.module';
import { TableModule } from './modules/tables/table.module';
import { StockModule } from './modules/stock/stock.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RecipeModule } from './modules/recipes/recipe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.development', '.env.production'],
      cache: true,
      load: [config, awsConfig, smtpConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigProps>) => ({
        uri: configService.get<string>('mongodb.database.connectionString', { infer: true }),
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }),
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    AdminModule,
    SupplierModule,
    AuthModule,
    FileUploadModule,
    ItemModule,
    EmailModule,
    PurchaseModule,
    CustomerModule,
    EmployeeModule,
    SalesModule,
    CategoryModule,
    LoginHistoryModule,
    NotificationModule,
    BranchModule,
    TableModule,
    RecipeModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
