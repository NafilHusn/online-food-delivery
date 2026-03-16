import { BadRequestException, Injectable } from '@nestjs/common';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import { RestaurantQueryBuilder } from '../query-builder/restaurant.query-builder';

@Injectable()
export class RestaurantValidator {
  constructor(
    private readonly repo: RestaurantRepository,
    private readonly queryBuilder: RestaurantQueryBuilder,
  ) {}

  async isExistingRestaurant(name: string, id?: string) {
    const where = this.queryBuilder.buildCheckExistingRestaurantQuery(name, id);
    const existingRestaurant = await this.repo.findFirst(where);
    if (existingRestaurant)
      throw new BadRequestException('Restaurant already exists');
    return existingRestaurant;
  }
}
