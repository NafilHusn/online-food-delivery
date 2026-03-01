import { BadRequestException, Injectable } from '@nestjs/common';
import { MenuCategoryRepository } from '../repositories/menu-category.repository';
import { MenuCategoryQueryBuilder } from '../query-builder/menu-category.query-builder';
import { MenuItemRepository } from '../repositories/menu-item.repository';
import { MenuItemQueryBuilder } from '../query-builder/menu-item.query-builder';
import { RestaurantService } from '../../restaurant/services/restaurant.service';

@Injectable()
export class MenuValidator {
  constructor(
    private readonly categoryRepo: MenuCategoryRepository,
    private readonly categoryQueryBuilder: MenuCategoryQueryBuilder,
    private readonly itemRepo: MenuItemRepository,
    private readonly itemQueryBuilder: MenuItemQueryBuilder,
    private readonly restaurantService: RestaurantService,
  ) {}

  async isExistingCategory(name: string, restaurantId: string, id?: string) {
    const where = this.categoryQueryBuilder.buildCheckExistingCategoryQuery(
      name,
      restaurantId,
      id,
    );
    const existingCategory = await this.categoryRepo.findFirst(where);
    if (existingCategory)
      throw new BadRequestException(
        'Menu category already exists in this restaurant',
      );
    return existingCategory;
  }

  async isExistingItem(name: string, categoryId: string, id?: string) {
    const where = this.itemQueryBuilder.buildCheckExistingItemQuery(
      name,
      categoryId,
      id,
    );
    const existingItem = await this.itemRepo.findFirst(where);
    if (existingItem)
      throw new BadRequestException(
        'Menu item already exists in this category',
      );
    return existingItem;
  }

  async isValidRestaurant(restaurantId: string) {
    const restaurant = await this.restaurantService.findById(restaurantId);
    if (!restaurant) throw new BadRequestException('Restaurant not found');
    return restaurant;
  }
}
