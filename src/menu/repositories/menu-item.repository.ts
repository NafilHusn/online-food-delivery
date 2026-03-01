import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import DatabaseService from 'utils/db/db.service';
import { MenuItemQueryBuilder } from '../query-builder/menu-item.query-builder';

@Injectable()
export class MenuItemRepository {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly queryBuilder: MenuItemQueryBuilder,
  ) {}

  async findOne(where: Prisma.MenuItemsWhereInput) {
    const entry = await this.dbService.menuItems.findFirst({
      where,
    });
    return entry;
  }

  async findFirst(where: Prisma.MenuItemsWhereInput) {
    return await this.dbService.menuItems.findFirst({
      where,
    });
  }

  async update(id: string, data: Prisma.MenuItemsUpdateInput) {
    const updated = await this.dbService.menuItems.update({
      where: { id, deletedAt: null },
      data,
    });
    return updated;
  }

  async delete(id: string) {
    return await this.dbService.menuItems.update({
      where: { id },
      data: { deletedAt: new Date(), active: false },
    });
  }

  async findMany(
    where?: Prisma.MenuItemsWhereInput,
    skip?: number,
    limit?: number,
    select: Prisma.MenuItemsSelect = this.queryBuilder.buildSelectQuery(),
  ) {
    const entries = await this.dbService.menuItems.findMany({
      where,
      skip,
      take: limit,
      select,
    });
    return entries;
  }

  async insert(
    data: Prisma.MenuItemsCreateInput,
    db: Prisma.TransactionClient = this.dbService,
  ) {
    const createdItem = await db.menuItems.create({ data });
    return createdItem;
  }

  async count(where?: Prisma.MenuItemsWhereInput) {
    return await this.dbService.menuItems.count({ where });
  }
}
