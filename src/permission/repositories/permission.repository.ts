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

  async getPermissionKeysByRole(role: string[]) {
    const cache = await this.cache.getMembers(
      `permission:role:${role.join(',')}`,
    );
    if (cache && cache.length > 0) return cache;
    const permissions = await this.db.permission.findMany({
      where: {
        rolePermissions: {
          some: {
            role: {
              name: { in: role },
            },
          },
        },
      },
      select: { key: true },
    });
    const permissionKeys = permissions.map((p) => p.key);
    await this.cache.setAdd(
      `permission:role:${role.join(',')}`,
      permissionKeys,
    );
    return permissionKeys;
  }

  async setPermissionToCache() {
    // for (const r of Object.values(Roles)) {
    await this.getPermissionKeysByRole(Object.values(Roles));
    // }
  }

  async checkPermission(role: string, permission: string) {
    try {
      return this.cache.getMember(`permission:role:${role}`, permission);
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

  async getAllPermissionsWithModules(roles: string[]) {
    const cache = await this.cache.get(`permission:modules:${roles.join(',')}`);
    if (cache && cache.length > 0) return cache;
    const modules = await this.db.module.findMany({
      where: {
        permissions: {
          some: {
            rolePermissions: {
              some: {
                role: {
                  name: { in: roles },
                },
              },
            },
          },
        },
      },
      select: {
        name: true,
        permissions: {
          where: {
            rolePermissions: {
              some: {
                role: {
                  name: { in: roles },
                },
              },
            },
          },
          select: {
            id: true,
            key: true,
            action: true,
          },
        },
      },
    });
    await this.cache.set(`permission:modules:${roles.join(',')}`, modules);
    return modules;
  }
}
