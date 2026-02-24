import { Module } from '@nestjs/common';
import { DatabaseModule } from 'utils/db/db.module';
import { RoleModule } from './roles/role.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RoleModule,
  ],
})
export class AppModule {}
