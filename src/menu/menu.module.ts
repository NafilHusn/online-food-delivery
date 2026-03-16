import { Module } from '@nestjs/common';
import { MenuCategoryService } from './services/menu-category.service';
import { MenuItemService } from './services/menu-item.service';
import { MenuCategoryRepository } from './repositories/menu-category.repository';
import { MenuItemRepository } from './repositories/menu-item.repository';
import { MenuCategoryQueryBuilder } from './query-builder/menu-category.query-builder';
import { MenuItemQueryBuilder } from './query-builder/menu-item.query-builder';
import { MenuCategoryController } from './controllers/menu-category.controller';
import { MenuItemController } from './controllers/menu-item.controller';
import { MenuValidator } from './validators/menu.validator';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports: [RestaurantModule],
  controllers: [MenuCategoryController, MenuItemController],
  providers: [
    MenuCategoryService,
    MenuItemService,
    MenuCategoryRepository,
    MenuItemRepository,
    MenuCategoryQueryBuilder,
    MenuItemQueryBuilder,
    MenuValidator,
  ],
  exports: [MenuCategoryService, MenuItemService],
})
export class MenuModule {}
