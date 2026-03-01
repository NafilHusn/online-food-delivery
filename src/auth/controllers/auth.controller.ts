import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Post,
  Req,
} from '@nestjs/common';
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import {
  LoginDto,
  LoginResponseTypeDTO,
  ProfileDTO,
  UpdateProfileParamsDTO,
} from '../dto/auth.dto';
import { ProtectRoute } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';
import { CurrentSession } from 'src/session/decorators/current-session';
import type { UserSession } from '@prisma/client';
import type { RequestWithUser } from '../types/request-with-user';

@Controller('auth')
export class AuthController {
  constructor(protected readonly service: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResponseTypeDTO })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseTypeDTO> {
    return await this.service.validateLogin(loginDto);
  }

  @ProtectRoute()
  @Get('profile')
  @ApiOkResponse({ type: ProfileDTO })
  getProfile(@Req() req: RequestWithUser): ProfileDTO {
    return {
      id: req.user.id,
      name: req.user.name,
      phone: req.user.phone,
      email: req.user.email,
      roles: req.user.Role,
    };
  }

  @ProtectRoute()
  @Post('/update_profile')
  @ApiOkResponse({ type: ProfileDTO })
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() params: UpdateProfileParamsDTO,
  ) {
    await this.service.updateProfile({
      id: req.user.id,
      ...params,
    });
    return { updated: true };
  }

  @ProtectRoute()
  @Post('logout')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        loggedOut: {
          type: 'boolean',
        },
      },
    },
  })
  async logout(@CurrentSession() session: UserSession) {
    try {
      await this.service.logout(session.id);
      return { loggedOut: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('/refresh_token')
  @ApiHeader({
    name: 'x-refresh-token',
    required: true,
  })
  async refreshToken(@Headers('x-refresh-token') token: string) {
    if (!token) {
      throw new ForbiddenException();
    }
    token = token.split('Bearer ')[1];
    if (!token) {
      throw new ForbiddenException();
    }
    return await this.service.refreshAccessToken(token);
  }
}
