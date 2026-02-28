import { Injectable } from '@nestjs/common';
import { Roles, RoleNames } from '../constants/role.constants';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepository) {}

  checkRole = (roleName: string) => (role: string) => role === roleName;

  checkAdminRole = this.checkRole(Roles.ADMIN);

  async getRoleByName(name: RoleNames) {
    return await this.roleRepo.findOne({ name });
  }

  async getRoleById(id: string) {
    return await this.roleRepo.findOne({ id });
  }

  async getRoleByIds(ids: string[]) {
    return await this.roleRepo.findMany({ id: { in: ids } });
  }

  async getAllRoles() {
    return await this.roleRepo.findMany({});
  }
}
