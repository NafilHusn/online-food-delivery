import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import DatabaseService from 'utils/db/db.service';
import { UserQueryBuilder } from '../query-builder/user.query-builder';

@Injectable()
export class UserRepository {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly queryBuilder: UserQueryBuilder,
  ) {}

  async findOne(params: {
    phoneNumber?: string;
    roleId?: string;
    id?: string;
    email?: string;
    customerId?: string;
  }) {
    const where = this.queryBuilder.buildListWhereQuery(params);
    const entry = await this.dbService.user.findFirst({
      where,
      include: { Role: true },
    });
    return entry;
  }

  async findFirst(where: Prisma.UserWhereInput) {
    return await this.dbService.user.findFirst({
      where,
      include: { Role: true },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    const updated = await this.dbService.user.update({
      where: { id, deletedAt: null },
      data,
    });
    return updated;
  }

  async delete(id: string) {
    return await this.dbService.user.update({
      where: { id },
      data: { deletedAt: new Date(), active: false },
    });
  }

  async findMany(params: { roleId?: string }) {
    const where = this.queryBuilder.buildListWhereQuery(params);
    const entries = await this.dbService.user.findMany({ where });
    return entries;
  }

  async insert(
    data: Prisma.UserUncheckedCreateInput,
    db: Prisma.TransactionClient = this.dbService,
  ) {
    const createdUser = await db.user.create({ data });
    return createdUser;
  }
}
