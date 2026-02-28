import { Module } from '@nestjs/common';
import { DatabaseModule } from 'utils/db/db.module';
import { RoleModule } from './roles/role.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from '../utils/config/config.schema';
import { SessionModule } from './session/session.module';
import { SwaggerModule } from './swagger/swagger.module';
import { PermissionModule } from './permission/permission.module';
import { SharedCacheModule } from '../utils/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    DatabaseModule,
    SharedCacheModule,
    SwaggerModule,
    RoleModule,
    UsersModule,
    AuthModule,
    SessionModule,
    PermissionModule,
  ],
})
export class AppModule {}
