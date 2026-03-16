import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import DatabaseService from 'utils/db/db.service';
import { OrderQueryBuilder } from '../query-builder/order.query-builder';

@Injectable()
export class OrderRepository {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly queryBuilder: OrderQueryBuilder,
  ) {}

  async findOne(
    where: Prisma.OrderWhereInput,
    select: Prisma.OrderSelect = this.queryBuilder.buildSelectQuery(),
  ) {
    const entry = await this.dbService.order.findFirst({
      where,
      select,
    });
    return entry;
  }

  async findFirst(
    where: Prisma.OrderWhereInput,
    select: Prisma.OrderSelect = this.queryBuilder.buildSelectQuery(),
  ) {
    return await this.dbService.order.findFirst({
      where,
      select,
    });
  }

  async update(
    id: string,
    data: Prisma.OrderUpdateInput,
    select: Prisma.OrderSelect = this.queryBuilder.buildSelectQuery(),
  ) {
    const updated = await this.dbService.order.update({
      where: { id },
      data,
      select,
    });
    return updated;
  }

  async delete(id: string) {
    return await this.dbService.order.delete({
      where: { id },
    });
  }

  async findMany(
    where?: Prisma.OrderWhereInput,
    skip?: number,
    limit?: number,
    select: Prisma.OrderSelect = this.queryBuilder.buildSelectQuery(),
  ) {
    const entries = await this.dbService.order.findMany({
      where,
      skip,
      take: limit,
      select,
      orderBy: { createdAt: 'desc' },
    });
    return entries;
  }

  async insert(
    data: Prisma.OrderCreateInput,
    db: Prisma.TransactionClient = this.dbService,
  ) {
    const createdOrder = await db.order.create({
      data: data,
      include: { orderItems: true },
    });
    return createdOrder;
  }

  async count(where?: Prisma.OrderWhereInput) {
    return await this.dbService.order.count({ where });
  }
}
