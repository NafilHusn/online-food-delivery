import { Module } from '@nestjs/common';
import { SwaggerCustomController } from './swagger.controller';

@Module({
  controllers: [SwaggerCustomController],
})
export class SwaggerModule {}
