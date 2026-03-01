import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import DatabaseService from 'utils/db/db.service';
import { MenuCategoryQueryBuilder } from '../query-builder/menu-category.query-builder';

@Injectable()
export class MenuCategoryRepository {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly queryBuilder: MenuCategoryQueryBuilder,
  ) {}

  async findOne(where: Prisma.MenuCategoryWhereInput) {
    const entry = await this.dbService.menuCategory.findFirst({
      where,
    });
    return entry;
  }

  async findFirst(where: Prisma.MenuCategoryWhereInput) {
    return await this.dbService.menuCategory.findFirst({
      where,
    });
  }

  async update(id: string, data: Prisma.MenuCategoryUpdateInput) {
    const updated = await this.dbService.menuCategory.update({
      where: { id, deletedAt: null },
      data,
    });
    return updated;
  }

  async delete(id: string) {
    return await this.dbService.menuCategory.update({
      where: { id },
      data: { deletedAt: new Date(), active: false },
    });
  }

  async findMany(
    where?: Prisma.MenuCategoryWhereInput,
    skip?: number,
    limit?: number,
    select: Prisma.MenuCategorySelect = this.queryBuilder.buildSelectQuery(),
  ) {
    const entries = await this.dbService.menuCategory.findMany({
      where,
      skip,
      take: limit,
      select,
    });
    return entries;
  }

  async insert(
    data: Prisma.MenuCategoryCreateInput,
    db: Prisma.TransactionClient = this.dbService,
  ) {
    const createdCategory = await db.menuCategory.create({ data });
    return createdCategory;
  }

  async count(where?: Prisma.MenuCategoryWhereInput) {
    return await this.dbService.menuCategory.count({ where });
  }
}
