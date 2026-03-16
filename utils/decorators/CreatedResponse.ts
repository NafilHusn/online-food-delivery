import { ApiOkResponse } from '@nestjs/swagger';

export const CreatedResponse = (schema?: Record<string, any>) =>
  ApiOkResponse({
    schema: { properties: { id: { type: 'string' }, ...schema } },
  });
