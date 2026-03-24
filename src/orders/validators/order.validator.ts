import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { RestaurantService } from '../../restaurant/services/restaurant.service';
import { OrderStatus } from '@prisma/client';
import { OrderItemDto } from '../dto/order.dto';
import { MenuItemService } from '../../menu/services/menu-item.service';

@Injectable()
export class OrderValidator {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly restaurantService: RestaurantService,
    private readonly menuItemService: MenuItemService,
  ) {}

  async isRestaurantExist(id: string) {
    const restaurant = await this.restaurantService.findById(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  async isOrderExist(id: string) {
    const order = await this.orderRepo.findOne({ id });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async isOrderEditable(id: string) {
    const order = await this.isOrderExist(id);
    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.ACCEPTED
    ) {
      throw new BadRequestException('Order is not editable');
    }
    return order;
  }

  async isItemRelatedToSameRestaurant(
    items: OrderItemDto[],
    restaurantId: string,
  ) {
    const menuItems = await this.menuItemService.findAll({
      id: { in: items.map((item) => item.menuItemId) },
      category: {
        restaurant: { id: restaurantId },
      },
    });
    if (menuItems.length !== items.length) {
      throw new BadRequestException(
        'All menu items must belong to the same restaurant',
      );
    }
    return menuItems;
  }
}
