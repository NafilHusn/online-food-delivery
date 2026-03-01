import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  NotEmptyString,
  OptionalString,
  UUIDString,
} from '../../../utils/string.helper';
import { Limit, Skip } from '../../../utils/pagination.helper';
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateRestaurantDto {
  @NotEmptyString()
  name: string;

  @NotEmptyString()
  country: string;
}

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @UUIDString()
  id: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class GetRestaurantsParamsDto {
  @OptionalString()
  search?: string;

  @OptionalString()
  country?: string;

  @Limit()
  limit: number;

  @Skip()
  skip: number;
}

export class ResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class DeleteRestaurantDto {
  @UUIDString()
  id: string;
}
