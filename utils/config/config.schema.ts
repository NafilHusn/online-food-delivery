import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('development', 'production'),
  BACKEND_URL: Joi.string().uri().required(),
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRES: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRES: Joi.string().required(),
  THROTTLING_TTL: Joi.number().required(),
  THROTTLING_REQUESTS_LIMIT: Joi.number().required(),
  FILE_LOGGING_ENABLED: Joi.bool().required(),
  DB_LOGGING_ENABLED: Joi.bool().required(),
});
