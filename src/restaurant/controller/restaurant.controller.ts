import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RestaurantService } from '../services/restaurant.service';
import {
  CreateRestaurantDto,
  DeleteRestaurantDto,
  GetRestaurantsParamsDto,
  ResponseDto,
  UpdateRestaurantDto,
} from '../dto/restaurant.dto';
import { ProtectRoute } from '../../auth/guards/auth.guard';
import { PermissionGuard } from '../../permission/guards/permission.guard';
import { ApiOkResponseWithData } from '../../../utils/decorators/ResponseFormat';
import { CreatedResponse } from '../../../utils/decorators/CreatedResponse';
import { DeletedResponse } from '../../../utils/decorators/DeletedResponse';
import { UpdatedResponse } from '../../../utils/decorators/UpdatedResponse';
import { CountryScope, WithCountryScope } from '../../users/interceptors/country-scoper.interceptor';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly service: RestaurantService) {}

  @Post()
  @CreatedResponse()
  @PermissionGuard(['restaurant:create'])
  @ProtectRoute()
  async create(@Body() dto: CreateRestaurantDto) {
    return await this.service.createRestaurant(dto);
  }

  @Put()
  @PermissionGuard(['restaurant:update'])
  @UpdatedResponse()
  @ProtectRoute()
  async update(@Body() dto: UpdateRestaurantDto) {
    return await this.service.updateRestaurant(dto);
  }

  @Get()
  @ApiOkResponseWithData(ResponseDto, true)
  @WithCountryScope()
  @PermissionGuard(['restaurant:read'])
  @ProtectRoute()
  async list(
    @Query() params: GetRestaurantsParamsDto,
    @CountryScope() countryScope: string,
  ) {
    if (countryScope) {
      params.country = countryScope;
    }
    return await this.service.getAllRestaurants(params);
  }

  @Delete()
  @DeletedResponse()
  @PermissionGuard(['restaurant:delete'])
  @ProtectRoute()
  async delete(@Query() params: DeleteRestaurantDto) {
    return await this.service.deleteRestaurant(params.id);
  }
}
