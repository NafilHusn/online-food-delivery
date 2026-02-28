import { Injectable } from '@nestjs/common';
import DatabaseService from '../../../utils/db/db.service';
import { Prisma } from '@prisma/client';
import { Roles } from '../../roles/constants/role.constants';
import { CacheService } from '../../../utils/cache/cache.service';

@Injectable()
export class PermissionRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly cache: CacheService,
  ) {}

  async upsertModule(module: Prisma.ModuleUpsertArgs) {
    return this.db.module.upsert(module);
  }

  async upsertPermission(permission: Prisma.PermissionUpsertArgs) {
    return this.db.permission.upsert(permission);
  }

  async getPermissionKeysByRole(role: string) {
    const cache = await this.cache.getMembers(`permission:role:${role}`);
    if (cache && cache.length > 0) return cache;
    const permissions = await this.db.permission.findMany({
      where: {
        rolePermissions: {
          some: {
            role: {
              name: role,
            },
          },
        },
      },
      select: { key: true },
    });
    const permissionKeys = permissions.map((p) => p.key);
    await this.cache.setAdd(`permission:role:${role}`, permissionKeys);
    return permissionKeys;
  }

  async setPermissionToCache() {
    for (const r of Object.values(Roles)) {
      await this.getPermissionKeysByRole(r);
    }
  }

  async checkPermission(role: string, permission: string) {
    try {
      return this.cache.getMember(`permission:${role}`, permission);
    } catch (error) {
      console.error(error);
      return this.db.permission.findFirst({
        where: {
          key: permission,
          rolePermissions: {
            some: {
              role: {
                name: role,
              },
            },
          },
        },
      });
    }
  }
}
