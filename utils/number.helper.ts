import { Type } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiPropertyOptions,
} from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/client';

export const ConvertToNumber = () => Type(() => Number);
export const ConvertToDecimal = () => Type(() => Decimal);

export const OptionalDecimal = (example?: number) =>
  applyDecorators(
    ApiPropertyOptional({
      type: Number,
      example: example,
    }),
    IsOptional(),
    ConvertToDecimal(),
  );

export const NotEmptyNumber = (args?: ApiPropertyOptions) =>
  applyDecorators(IsNumber(), ConvertToDecimal(), ApiProperty(args));

export function sanitizeToNumber(input?: string): number | undefined {
  if (!input) return undefined;

  const digits = input.replace(/\D+/g, '');
  return digits ? Number(digits) : undefined;
}
