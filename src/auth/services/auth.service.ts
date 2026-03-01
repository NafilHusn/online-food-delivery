import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SessionService } from '../../session/services/session.service';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import DateHelpers from 'utils/date.helper';
import { PasswordService } from 'utils/passwords.service';
import { UserService } from '../../users/services/users.service';
import ErrorMessages from '../constants/error_messages';
import { JWTPayload, LoginDto, LoginResponseTypeDTO } from '../dto/auth.dto';
import { UpdateUserDto } from '../../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateTokens(accountId: string, sessionId: string) {
    const refreshTokenTimeout = Number(
      (this.configService.get('JWT_REFRESH_TOKEN_EXPIRES') as string).split(
        'd',
      )[0],
    );
    const expiresAt = DateHelpers.addMinutesToDate(
      refreshTokenTimeout * 24 * 60,
    );
    const refreshToken = await this.sessionService.createRefreshToken(
      sessionId,
      expiresAt,
    );
    return {
      token: this.signJWT(
        { userId: accountId, sessionId },
        this.configService.get('JWT_ACCESS_TOKEN_EXPIRES'),
      ),
      refreshToken: this.signJWT(
        { id: refreshToken.id },
        this.configService.get('JWT_REFRESH_TOKEN_EXPIRES'),
      ),
    };
  }

  private async createSession(
    account: User,
    sessionId: string,
  ): Promise<LoginResponseTypeDTO> {
    const tokens = await this.generateTokens(account.id, sessionId);
    return {
      ...tokens,
      userData: {
        email: account.email,
        id: account.id,
        name: account.name,
        phone: account.phone,
        timestamp: DateHelpers.getCurrentDate(),
      },
    };
  }

  async validateLogin(loginDto: LoginDto): Promise<LoginResponseTypeDTO> {
    try {
      const account = await this.validateCredentials(loginDto);
      const createdSessionId = await this.sessionService.createSession(
        account.id,
        loginDto.firebaseToken,
      );
      await this.userService.updateAccount({
        id: account.id,
        lastLoginAt: DateHelpers.getCurrentDate(),
      });
      return await this.createSession(account, createdSessionId);
    } catch (error) {
      throw new BadRequestException(
        error.message ?? ErrorMessages.invalidCredentials,
      );
    }
  }

  async validateCredentials(loginDto: LoginDto) {
    const account = await this.userService.findOneByEmail(loginDto.email);

    const invalid = () =>
      new BadRequestException(ErrorMessages.invalidCredentials);

    if (!account?.password) throw invalid();

    const isValidPassword = await this.passwordService.comparePasswords(
      loginDto.password,
      account.password,
    );
    if (!isValidPassword) throw invalid();

    return account;
  }

  private signJWT(payload: Record<string, any>, expiresIn?: string | number) {
    return this.jwtService.sign(payload, { expiresIn: expiresIn as number });
  }

  async logout(sessionId: string) {
    await this.sessionService.deleteSession(sessionId);
    return { loggedOut: true };
  }

  getToken(token: string) {
    return token.split('Bearer ')[1];
  }

  async getJWTPayload<T extends object = JWTPayload>(jwt: string) {
    return await this.jwtService.verifyAsync<T>(jwt, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  async updateProfile(params: UpdateUserDto) {
    return await this.userService.updateAccount(params);
  }

  async refreshAccessToken(refreshBearerToken: string) {
    try {
      const decoded = this.jwtService.decode<{ id: string }>(
        refreshBearerToken,
      );
      if (!decoded.id) throw new ForbiddenException();
      const entry = await this.sessionService.validateRefreshToken(decoded.id);
      if (!entry || !entry.id) throw new ForbiddenException();
      await this.sessionService.deleteRefreshToken(entry.id);
      const sessionDetails = await this.sessionService.findOne(entry.sessionId);
      if (!sessionDetails) throw new ForbiddenException();
      return await this.generateTokens(
        sessionDetails.userId,
        sessionDetails.id,
      );
    } catch (error) {
      Logger.error(error.message);
      throw new ForbiddenException();
    }
  }

  // async getUnreadNotificationCount(userId: string) {
  //   return await this.notifyService.getUnreadNotificationCount(userId);
  // }

  async deleteAccount(id: string) {
    return await this.userService.deleteAccount(id);
  }
}
