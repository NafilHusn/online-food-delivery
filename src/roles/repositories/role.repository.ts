import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import DatabaseService from 'utils/db/db.service';

@Injectable()
export class RoleRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async insert(data: Prisma.RoleCreateInput) {
    const insertedRole = await this.dbService.role.create({ data });
    return insertedRole;
  }

  async findOne(where: Prisma.RoleWhereInput) {
    return await this.dbService.role.findFirst({
      where,
    });
  }
}
