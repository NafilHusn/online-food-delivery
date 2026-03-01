import { IsEmail, IsEnum } from 'class-validator';
import {
  NotEmptyString,
  OptionalString,
  UUIDString,
} from '../../../utils/string.helper';
import { COUNTRY_LIST } from '../constants/user.constant';
import { NotEmptyArray, OptionalArray } from '../../../utils/array.helper';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { OptionalDate } from '../../../utils/date.helper';
import { Limit, Skip } from '../../../utils/pagination.helper';
import { RoleDto } from '../../roles/dto/role.dto';

export class CreateUserDto {
  @OptionalString()
  name?: string;

  @NotEmptyString()
  @IsEmail()
  email: string;

  @NotEmptyString()
  password: string;

  @OptionalString()
  phone?: string;

  @NotEmptyString({ enum: COUNTRY_LIST, default: 'India' })
  @IsEnum(COUNTRY_LIST)
  country: string;

  @OptionalString()
  profilePicture?: string;

  @NotEmptyArray()
  roleIds: string[];
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @UUIDString()
  id: string;

  lastLoginAt?: Date;
}

export class GetUsersParamsDto {
  @OptionalArray()
  roleIds?: string[];

  @OptionalString()
  search?: string;

  @OptionalString()
  country?: string;

  @OptionalString()
  phone?: string;

  @OptionalString()
  email?: string;

  @OptionalDate()
  fromDate?: string;

  @OptionalDate()
  toDate?: string;

  @Limit()
  limit: number;

  @Skip()
  skip: number;
}

export class ResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  profilePicture: string;

  @ApiProperty({ type: [RoleDto] })
  Role: RoleDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  lastLoginAt: Date;
}

export class DeleteUserDto {
  @UUIDString()
  id: string;
}
