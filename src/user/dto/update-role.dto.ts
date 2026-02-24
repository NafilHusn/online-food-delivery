import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../constants/role.enum';

export class UpdateRoleDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
