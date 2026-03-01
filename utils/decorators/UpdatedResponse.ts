import { ApiOkResponse } from '@nestjs/swagger';

export const UpdatedResponse = (schema?: Record<string, any>) =>
  ApiOkResponse({
    schema: { properties: { updated: { type: 'boolean' }, ...schema } },
  });
