import { Injectable, OnModuleInit } from '@nestjs/common';
import { RoleNames, RoleNamesObj } from '../constants/role.constants';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(private readonly roleRepo: RoleRepository) {}

  private roleNames: RoleNames[] = Object.values(RoleNamesObj);

  checkRole = (roleName: string) => (role: string) => role === roleName;

  checkAdminRole = this.checkRole(RoleNamesObj.ADMIN);

  async onModuleInit() {
    for (const roleName of this.roleNames) {
      const roleExists = await this.getRoleByName(roleName);
      if (!roleExists) {
        await this.roleRepo.insert({ name: roleName });
      }
    }
  }

  async getRoleByName(name: RoleNames) {
    return await this.roleRepo.findOne({ name });
  }

  async getRoleById(id: string) {
    return await this.roleRepo.findOne({ id });
  }
}
