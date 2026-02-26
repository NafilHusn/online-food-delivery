import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { DatabaseModule } from 'utils/db/db.module';
import { PasswordService } from 'utils/passwords.service';
import { AuthController } from './controllers/auth.controller';

@Global()
@Module({
  imports: [
    ConfigModule,
    DatabaseModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<number>('JWT_ACCESS_TOKEN_EXPIRES'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [Logger, AuthService, JwtStrategy, PasswordService],
  exports: [AuthService],
})
export class AuthModule {}
