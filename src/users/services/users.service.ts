import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RoleService } from 'src/roles/services/role.service';
import { PasswordService } from 'utils/passwords.service';
import { UserRepository } from '../repositories/user.repository';
import { RoleNames } from 'src/roles/constants/role.constants';
import { UserQueryBuilder } from '../query-builder/user.query-builder';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleService: RoleService,
    private readonly passwordService: PasswordService,
    private readonly queryBuilder: UserQueryBuilder,
  ) {}

  async findOneByEmail(email: string, roleName?: RoleNames) {
    let roleId: string | undefined;
    if (roleName) {
      const roleDetails = await this.roleService.getRoleByName(roleName);
      if (!roleDetails) throw new InternalServerErrorException();
      roleId = roleDetails.id;
    }
    return await this.userRepo.findOne({ email, roleId });
  }

  async findById(id: string) {
    return await this.userRepo.findOne({ id });
  }

  async findUserOfCustomer(customerId: string) {
    return await this.userRepo.findOne({ customerId });
  }

  async updateAccount(
    id: string,
    updateData: Partial<{
      email: string;
      name: string;
      password: string;
      lastLoginAt: Date;
      active: boolean;
      phone: string;
      profilePicture: string;
    }>,
  ) {
    if (updateData.email) {
      const where = this.queryBuilder.buildCheckExistingUserQuery(
        updateData.email,
        id,
      );
      const existingUser = await this.userRepo.findFirst(where);
      if (existingUser) throw new BadRequestException('User already exists');
    }
    const { password } = updateData;
    if (password) {
      updateData.password = await this.passwordService.hashPassword(password);
    }
    return await this.userRepo.update(id, updateData);
  }

  async createAccount(
    roleIds: string[],
    email: string,
    password: string,
    phone?: string,
    db?: Prisma.TransactionClient,
    name?: string,
    profilePicture?: string,
  ) {
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) throw new BadRequestException('User already exists');
    const createInput: Prisma.UserUncheckedCreateInput = {
      email,
      phone,
      name,
      Role: { connect: roleIds.map((roleId) => ({ id: roleId })) },
      password,
      profilePicture,
    };
    if (password)
      createInput.password = await this.passwordService.hashPassword(password);
    return await this.userRepo.insert(createInput, db);
  }

  async findByRole(roleName: RoleNames) {
    const roleDetails = await this.roleService.getRoleByName(roleName);
    if (!roleDetails) throw new InternalServerErrorException();
    return await this.userRepo.findMany({ roleId: roleDetails.id });
  }

  async deleteAccount(id: string) {
    return await this.userRepo.delete(id);
  }
}
