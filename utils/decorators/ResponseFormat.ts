// common/decorators/api-ok-response.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiOkResponseWithData = <TModel extends Type<any>>(
  model: TModel,
  isArray = false,
  withTotalCount = isArray,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          data: isArray
            ? {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              }
            : {
                $ref: getSchemaPath(model),
              },
          ...(withTotalCount
            ? {
                total: {
                  type: 'number',
                  example: 10,
                },
              }
            : {}),
        },
      },
    }),
  );
};
