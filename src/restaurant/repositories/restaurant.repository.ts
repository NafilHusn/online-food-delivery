import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import DatabaseService from 'utils/db/db.service';
import { RestaurantQueryBuilder } from '../query-builder/restaurant.query-builder';

@Injectable()
export class RestaurantRepository {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly queryBuilder: RestaurantQueryBuilder,
  ) {}

  async findOne(where: Prisma.RestaurantWhereInput) {
    const entry = await this.dbService.restaurant.findFirst({
      where,
    });
    return entry;
  }

  async findFirst(where: Prisma.RestaurantWhereInput) {
    return await this.dbService.restaurant.findFirst({
      where,
    });
  }

  async update(id: string, data: Prisma.RestaurantUpdateInput) {
    const updated = await this.dbService.restaurant.update({
      where: { id, deletedAt: null },
      data,
    });
    return updated;
  }

  async delete(id: string) {
    return await this.dbService.restaurant.update({
      where: { id },
      data: { deletedAt: new Date(), active: false },
    });
  }

  async findMany(
    where?: Prisma.RestaurantWhereInput,
    skip?: number,
    limit?: number,
    select: Prisma.RestaurantSelect = this.queryBuilder.buildSelectQuery(),
  ) {
    const entries = await this.dbService.restaurant.findMany({
      where,
      skip,
      take: limit,
      select,
    });
    return entries;
  }

  async insert(
    data: Prisma.RestaurantCreateInput,
    db: Prisma.TransactionClient = this.dbService,
  ) {
    const createdRestaurant = await db.restaurant.create({ data });
    return createdRestaurant;
  }

  async count(where?: Prisma.RestaurantWhereInput) {
    return await this.dbService.restaurant.count({ where });
  }
}
