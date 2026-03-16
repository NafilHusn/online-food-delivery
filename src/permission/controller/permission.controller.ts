import { Controller, Get } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { CurrentUser } from '../../auth/decorators/current-user';
import type { UserWithRole } from '../../auth/types/request-with-user';
import { ProtectRoute } from '../../auth/guards/auth.guard';

@ProtectRoute()
@Controller('permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @Get('my-permissions')
  async getAllPermissions(@CurrentUser() user: UserWithRole) {
    const data = await this.service.getPermissionByRole(
      user.Role?.map((r) => r.name),
    );
    return { data };
  }
}
