import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { RequestWithUser } from '../../auth/types/request-with-user';
import { Reflector } from '@nestjs/core';

const PERMISSION_KEY = 'permissions';
export type PermissionMode = 'ALL' | 'ANY';

@Injectable()
export class PermissionGuardClass implements CanActivate {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const meta = this.reflector.getAllAndOverride<{
      permissions: string[];
      mode: PermissionMode;
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (!meta) return true;

    const { permissions: required, mode } = meta;

    const userRoles = request.user.Role;
    if (!userRoles || userRoles.length === 0) {
      return false;
    }

    const permissionSets = await Promise.all(
      userRoles.map((role) =>
        this.permissionService.getPermissionByRole(role.name),
      ),
    );

    const effectivePermissions = new Set(permissionSets.flat());

    if (mode === 'ALL') {
      return required.every((p) => effectivePermissions.has(p));
    }

    if (mode === 'ANY') {
      return required.some((p) => effectivePermissions.has(p));
    }

    return false;
  }
}

export const PermissionGuard = (
  permissions: string[],
  mode: PermissionMode = 'ALL',
) => {
  return applyDecorators(
    SetMetadata(PERMISSION_KEY, { permissions, mode }),
    UseGuards(PermissionGuardClass),
  );
};
