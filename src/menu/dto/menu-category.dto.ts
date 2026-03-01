import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  NotEmptyString,
  OptionalString,
  UUIDString,
} from '../../../utils/string.helper';
import { Limit, Skip } from '../../../utils/pagination.helper';
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateMenuCategoryDto {
  @NotEmptyString()
  name: string;

  @UUIDString()
  restaurantId: string;
}

export class UpdateMenuCategoryDto extends PartialType(CreateMenuCategoryDto) {
  @UUIDString()
  id: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class GetMenuCategoriesParamsDto {
  @OptionalString()
  search?: string;

  @OptionalString()
  restaurantId?: string;

  @Limit()
  limit: number;

  @Skip()
  skip: number;
}

export class MenuCategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  restaurantId: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class DeleteMenuCategoryDto {
  @UUIDString()
  id: string;
}
