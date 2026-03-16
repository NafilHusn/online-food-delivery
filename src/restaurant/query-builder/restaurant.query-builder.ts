import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateRestaurantDto,
  GetRestaurantsParamsDto,
} from '../dto/restaurant.dto';

@Injectable()
export class RestaurantQueryBuilder {
  buildCheckExistingRestaurantQuery(
    name: string,
    id?: string,
  ): Prisma.RestaurantWhereInput {
    const where: Prisma.RestaurantWhereInput = {
      deletedAt: null,
      name,
    };
    if (id) where.id = { not: id };
    return where;
  }

  buildCreateQuery(params: CreateRestaurantDto): Prisma.RestaurantCreateInput {
    return {
      name: params.name,
      country: params.country,
    };
  }

  buildListWhereQuery(
    params: Omit<GetRestaurantsParamsDto, 'limit' | 'skip'>,
  ): Prisma.RestaurantWhereInput {
    const { country, search } = params;
    const AND: Prisma.RestaurantWhereInput[] = [{ deletedAt: null }];

    if (country) AND.push({ country });
    if (search)
      AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { country: { contains: search, mode: 'insensitive' } },
        ],
      });
    return { AND };
  }

  buildSelectQuery() {
    return {
      id: true,
      name: true,
      country: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    } satisfies Prisma.RestaurantSelect;
  }
}
