import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import 'reflect-metadata';
import { RequestWithUser } from '../../auth/types/request-with-user';
import { PermissionService } from '../services/permission.service';

export const FIELD_PERMISSIONS_KEY = 'field_permission';

export interface FieldPermission {
  permissions: string[];
  mode?: 'ALL' | 'ANY';
}

@Injectable()
export class FieldPermissionGuardHandler implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const fieldMap = this.reflector.get<Record<string, FieldPermission>>(
      FIELD_PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!fieldMap) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userRoles = request.user?.Role;

    if (!userRoles?.length) {
      return true;
    }

    const permissionSets = await this.permissionService.getPermissionByRole(
      userRoles.map((r) => r.name),
    );

    const allowed = new Set(permissionSets);
    const body = request.body as Record<string, unknown>;

    for (const [key] of Object.entries(body)) {
      const requiredPermission = fieldMap[key];
      if (!requiredPermission) continue;

      const { permissions, mode = 'ALL' } = requiredPermission;

      if (mode === 'ALL') {
        const all = permissions.every((p) => allowed.has(p));
        if (!all) {
          throw new ForbiddenException(
            `Missing permission to update field '${key}'`,
          );
        }
      } else if (mode === 'ANY') {
        const any = permissions.some((p) => allowed.has(p));
        if (!any) {
          throw new ForbiddenException(
            `Missing permission to update field '${key}'`,
          );
        }
      }
    }

    return true;
  }
}

const FieldPermissionMetadata = (map: Record<string, FieldPermission>) =>
  SetMetadata(FIELD_PERMISSIONS_KEY, map);

export const FieldPermission = (map: Record<string, FieldPermission>) =>
  applyDecorators(
    FieldPermissionMetadata(map),
    UseGuards(FieldPermissionGuardHandler),
  );
