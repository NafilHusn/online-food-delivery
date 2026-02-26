import { Module } from '@nestjs/common';
import { DatabaseModule } from 'utils/db/db.module';
import { RoleModule } from './roles/role.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from '../utils/config/config.schema';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    DatabaseModule,
    RoleModule,
    UsersModule,
    AuthModule,
    SessionModule,
  ],
})
export class AppModule {}
