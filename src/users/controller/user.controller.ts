import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/users.service';
import {
  CreateUserDto,
  DeleteUserDto,
  GetUsersParamsDto,
  ResponseDto,
  UpdateUserDto,
} from '../dto/user.dto';
import { ProtectRoute } from '../../auth/guards/auth.guard';
import { PermissionGuard } from '../../permission/guards/permission.guard';
import { ApiOkResponseWithData } from '../../../utils/decorators/ResponseFormat';
import { CreatedResponse } from '../../../utils/decorators/CreatedResponse';
import { CurrentUser } from '../../auth/decorators/current-user';
import type { User } from '@prisma/client';
import { DeletedResponse } from '../../../utils/decorators/DeletedResponse';
import { UpdatedResponse } from '../../../utils/decorators/UpdatedResponse';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @CreatedResponse()
  @PermissionGuard(['user:create'])
  @ProtectRoute()
  async create(@Body() dto: CreateUserDto) {
    return await this.service.createAccount(dto);
  }

  @Put()
  @PermissionGuard(['user:update'])
  @UpdatedResponse()
  @ProtectRoute()
  async update(@Body() dto: UpdateUserDto) {
    return await this.service.updateAccount(dto);
  }

  @Get()
  @ApiOkResponseWithData(ResponseDto, true)
  @PermissionGuard(['user:read'])
  @ProtectRoute()
  async list(@Query() params: GetUsersParamsDto, @CurrentUser() user: User) {
    return await this.service.getAllUsers(params, user.id);
  }

  @Delete()
  @DeletedResponse()
  @PermissionGuard(['user:delete'])
  @ProtectRoute()
  async delete(@Query() params: DeleteUserDto) {
    return await this.service.deleteAccount(params.id);
  }
}
