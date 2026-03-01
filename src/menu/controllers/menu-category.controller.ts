import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MenuCategoryService } from '../services/menu-category.service';
import {
  CreateMenuCategoryDto,
  DeleteMenuCategoryDto,
  GetMenuCategoriesParamsDto,
  MenuCategoryResponseDto,
  UpdateMenuCategoryDto,
} from '../dto/menu-category.dto';
import { ProtectRoute } from '../../auth/guards/auth.guard';
import { PermissionGuard } from '../../permission/guards/permission.guard';
import { ApiOkResponseWithData } from '../../../utils/decorators/ResponseFormat';
import { CreatedResponse } from '../../../utils/decorators/CreatedResponse';
import { DeletedResponse } from '../../../utils/decorators/DeletedResponse';
import { UpdatedResponse } from '../../../utils/decorators/UpdatedResponse';

@Controller('menu-category')
export class MenuCategoryController {
  constructor(private readonly service: MenuCategoryService) {}

  @Post()
  @CreatedResponse()
  @PermissionGuard(['menu-category:create'])
  @ProtectRoute()
  async create(@Body() dto: CreateMenuCategoryDto) {
    return await this.service.createCategory(dto);
  }

  @Put()
  @PermissionGuard(['menu-category:update'])
  @UpdatedResponse()
  @ProtectRoute()
  async update(@Body() dto: UpdateMenuCategoryDto) {
    return await this.service.updateCategory(dto);
  }

  @Get()
  @ApiOkResponseWithData(MenuCategoryResponseDto, true)
  @PermissionGuard(['menu-category:read'])
  @ProtectRoute()
  async list(@Query() params: GetMenuCategoriesParamsDto) {
    return await this.service.getAllCategories(params);
  }

  @Delete()
  @DeletedResponse()
  @PermissionGuard(['menu-category:delete'])
  @ProtectRoute()
  async delete(@Query() params: DeleteMenuCategoryDto) {
    return await this.service.deleteCategory(params.id);
  }
}
