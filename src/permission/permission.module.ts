import { Global, Module } from '@nestjs/common';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionService } from './services/permission.service';
import { PermissionQueryBuilder } from './query-builder/permission.query-builder';
import { PermissionGuardClass } from './guards/permission.guard';
import { PermissionController } from './controller/permission.controller';

@Global()
@Module({
  providers: [
    PermissionRepository,
    PermissionService,
    PermissionQueryBuilder,
    PermissionGuardClass,
  ],
  controllers: [PermissionController],
  exports: [PermissionRepository, PermissionService, PermissionGuardClass],
})
export class PermissionModule {}
