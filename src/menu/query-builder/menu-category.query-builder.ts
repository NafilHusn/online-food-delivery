import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateMenuCategoryDto,
  GetMenuCategoriesParamsDto,
} from '../dto/menu-category.dto';

@Injectable()
export class MenuCategoryQueryBuilder {
  buildCheckExistingCategoryQuery(
    name: string,
    restaurantId: string,
    id?: string,
  ): Prisma.MenuCategoryWhereInput {
    const where: Prisma.MenuCategoryWhereInput = {
      deletedAt: null,
      name,
      restaurantId,
    };
    if (id) where.id = { not: id };
    return where;
  }

  buildCreateQuery(
    params: CreateMenuCategoryDto,
  ): Prisma.MenuCategoryCreateInput {
    return {
      name: params.name,
      restaurant: { connect: { id: params.restaurantId } },
    };
  }

  buildListWhereQuery(
    params: Omit<GetMenuCategoriesParamsDto, 'limit' | 'skip'>,
  ): Prisma.MenuCategoryWhereInput {
    const { restaurantId, search } = params;
    const AND: Prisma.MenuCategoryWhereInput[] = [{ deletedAt: null }];

    if (restaurantId) AND.push({ restaurantId });
    if (search)
      AND.push({
        OR: [{ name: { contains: search, mode: 'insensitive' } }],
      });
    return { AND };
  }

  buildSelectQuery() {
    return {
      id: true,
      name: true,
      restaurantId: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    } satisfies Prisma.MenuCategorySelect;
  }
}
