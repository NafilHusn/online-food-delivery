import { BadRequestException, Injectable } from '@nestjs/common';
import { MenuCategoryRepository } from '../repositories/menu-category.repository';
import { MenuCategoryQueryBuilder } from '../query-builder/menu-category.query-builder';
import {
  CreateMenuCategoryDto,
  GetMenuCategoriesParamsDto,
  UpdateMenuCategoryDto,
} from '../dto/menu-category.dto';
import { MenuValidator } from '../validators/menu.validator';

@Injectable()
export class MenuCategoryService {
  constructor(
    private readonly categoryRepo: MenuCategoryRepository,
    private readonly queryBuilder: MenuCategoryQueryBuilder,
    private readonly menuValidator: MenuValidator,
  ) {}

  async findById(id: string) {
    return await this.categoryRepo.findOne({ id });
  }

  async updateCategory(updateData: UpdateMenuCategoryDto) {
    const existingCategory = await this.findById(updateData.id);
    if (!existingCategory)
      throw new BadRequestException('Menu category not found');

    if (updateData.name) {
      await this.menuValidator.isExistingCategory(
        updateData.name,
        existingCategory.restaurantId,
        updateData.id,
      );
    }

    await this.categoryRepo.update(updateData.id, updateData);
    return { updated: true };
  }

  async createCategory(params: CreateMenuCategoryDto) {
    await this.menuValidator.isValidRestaurant(params.restaurantId);
    await this.menuValidator.isExistingCategory(
      params.name,
      params.restaurantId,
    );

    const createInput = this.queryBuilder.buildCreateQuery(params);
    const category = await this.categoryRepo.insert(createInput);
    return { id: category.id };
  }

  async getAllCategories(params: GetMenuCategoriesParamsDto) {
    const where = this.queryBuilder.buildListWhereQuery(params);
    const [data, total] = await Promise.all([
      this.categoryRepo.findMany(where, params.skip, params.limit),
      this.categoryRepo.count(where),
    ]);
    return {
      data,
      total,
    };
  }

  async deleteCategory(id: string) {
    const category = await this.findById(id);
    if (!category) throw new BadRequestException('Menu category not found');

    await this.categoryRepo.delete(id);
    return { deleted: true };
  }
}
