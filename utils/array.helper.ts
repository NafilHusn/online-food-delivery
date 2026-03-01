import { applyDecorators } from '@nestjs/common';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiPropertyOptions,
} from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { TransformToArray } from './decorators/TransformToArray';

export const NotEmptyArray = (args?: ApiPropertyOptions) =>
  applyDecorators(
    ApiProperty(args),
    IsNotEmpty(),
    TransformToArray(),
    IsArray(),
  );

export const OptionalArray = (args?: ApiPropertyOptions) =>
  applyDecorators(
    ApiPropertyOptional(args),
    IsOptional(),
    TransformToArray(),
    IsArray(),
  );
