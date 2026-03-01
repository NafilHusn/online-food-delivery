import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserQueryBuilder } from '../query-builder/user.query-builder';

@Injectable()
export class UserValidator {
  constructor(
    private readonly repo: UserRepository,
    private readonly queryBuilder: UserQueryBuilder,
  ) {}

  async isExistingUser(email?: string, id?: string) {
    if (!email || !id) return;
    const where = this.queryBuilder.buildCheckExistingUserQuery(email, id);
    const existingUser = await this.repo.findFirst(where);
    if (existingUser) throw new BadRequestException('User already exists');
    return existingUser;
  }
}
