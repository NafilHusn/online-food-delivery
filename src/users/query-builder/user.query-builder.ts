import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserQueryBuilder {
  buildListWhereQuery(params: {
    phone?: string;
    roleId?: string;
    id?: string;
    email?: string;
  }): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = { deletedAt: null };
    if (params.id) where.id = params.id;
    if (params.roleId) where.roleId = params.roleId;
    if (params.phone) where.phone = params.phone;
    if (params.email) where.email = params.email;
    return where;
  }

  buildCheckExistingUserQuery(
    email: string,
    id: string,
  ): Prisma.UserWhereInput {
    return {
      deletedAt: null,
      email,
      id: { not: id },
    };
  }
}
