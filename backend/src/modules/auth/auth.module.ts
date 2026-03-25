import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from 'src/modules/admins/admin.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../../common/guards/jwt.strategy';
import { RefreshTokenStrategy } from '../../common/guards/refreshToken.strategy';
import { EmployeeModule } from 'src/modules/employees/employee.module';
import { ConfigModule } from '@nestjs/config';
import { config } from 'src/configs/config';
import { LoginHistoryModule } from 'src/modules/login-history/login-history.module';

@Module({
  imports: [
    AdminModule,
    EmployeeModule,
    PassportModule,
    JwtModule.register({}),
    ConfigModule.forFeature(config),
    LoginHistoryModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
