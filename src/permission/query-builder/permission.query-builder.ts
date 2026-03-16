import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PermissionQueryBuilder {
  buildModuleUpsertArgs(moduleName: string): Prisma.ModuleUpsertArgs {
    return {
      where: { name: moduleName },
      create: { name: moduleName },
      update: {},
    };
  }

  buildPermissionUpsertArgs(
    permission: {
      key: string;
      action: string;
      assignedRoles: string[];
    },
    moduleId: string,
    roleMap: Map<string, string>,
  ) {
    return {
      where: { key: permission.key },
      create: {
        key: permission.key,
        action: permission.action,
        module: { connect: { id: moduleId } },
        rolePermissions: {
          createMany: {
            data: permission.assignedRoles.map((role) => ({
              roleId: roleMap.get(role)!,
            })),
            skipDuplicates: true,
          },
        },
      },
      update: {
        rolePermissions: {
          deleteMany: {
            roleId: {
              notIn: permission.assignedRoles,
            },
          },
          createMany: {
            data: permission.assignedRoles.map((role) => ({
              roleId: roleMap.get(role)!,
            })),
            skipDuplicates: true,
          },
        },
      },
    };
  }
}
