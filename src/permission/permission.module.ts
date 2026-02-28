import { Global, Module } from '@nestjs/common';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionService } from './services/permission.service';
import { PermissionQueryBuilder } from './query-builder/permission.query-builder';
import { PermissionGuard } from './guards/permission.guard';

@Global()
@Module({
  providers: [
    PermissionRepository,
    PermissionService,
    PermissionQueryBuilder,
    PermissionGuard,
  ],
  exports: [PermissionRepository, PermissionService, PermissionGuard],
})
export class PermissionModule {}
