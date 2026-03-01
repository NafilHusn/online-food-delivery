import { Global, Module } from '@nestjs/common';
import { RestaurantService } from './services/restaurant.service';
import { RestaurantRepository } from './repositories/restaurant.repository';
import { RestaurantQueryBuilder } from './query-builder/restaurant.query-builder';
import { RestaurantController } from './controller/restaurant.controller';
import { RestaurantValidator } from './validators/restaurant.validator';

@Global()
@Module({
  exports: [RestaurantService],
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    RestaurantQueryBuilder,
    RestaurantRepository,
    RestaurantValidator,
  ],
})
export class RestaurantModule {}
