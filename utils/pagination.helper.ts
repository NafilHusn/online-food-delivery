import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { ConvertToNumber } from './number.helper';

export const Limit = () =>
  applyDecorators(ApiProperty({ default: 10 }), IsNumber(), ConvertToNumber());

export const Skip = () =>
  applyDecorators(ApiProperty({ default: 0 }), IsNumber(), ConvertToNumber());
