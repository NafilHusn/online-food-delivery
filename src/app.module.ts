import { Module } from '@nestjs/common';
import { DatabaseModule } from 'utils/db/db.module';
import { RoleModule } from './roles/role.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RoleModule,
    UsersModule,
  ],
})
export class AppModule {}
