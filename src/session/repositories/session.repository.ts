import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Prisma, UserSession } from '@prisma/client';
import DatabaseService from 'utils/db/db.service';

@Injectable()
export class SessionRepository {
  constructor(private db: DatabaseService) {}

  async findSessionById(sessionId: string) {
    const session = await this.db.userSession.findFirst({
      where: { id: sessionId },
    });
    return session;
  }
  async findSessionsByAccountId(accountId: string) {
    return await this.db.userSession.findMany({
      where: { userId: accountId },
    });
  }

  async findSessions(where: Prisma.UserSessionWhereInput) {
    return await this.db.userSession.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
  }

  async createSession(userId: string, expiresAt: Date, fbToken: string = '') {
    let sessionsWithFBToken: UserSession[] = [];
    if (fbToken && fbToken !== '')
      sessionsWithFBToken = await this.db.userSession.findMany({
        where: { fcmToken: fbToken },
      });
    if (sessionsWithFBToken.length > 0)
      await this.db.userSession.deleteMany({
        where: { id: { in: sessionsWithFBToken.map((each) => each.id) } },
      });
    const createdSession = await this.db.userSession.create({
      data: {
        userId,
        expiresAt,
        fcmToken: fbToken,
      },
    });
    return createdSession;
  }

  private async cleanupOldSessions(userId: string): Promise<void> {
    try {
      const oldestSession = await this.db.userSession.findFirst({
        skip: 4,
        orderBy: { createdAt: 'desc' },
        where: { userId },
      });

      if (oldestSession) {
        await this.db.userSession.delete({ where: { id: oldestSession.id } });
      }
    } catch (err) {
      Logger.error('Error cleaning up old sessions:', err);
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.db.userSession.delete({
      where: { id: sessionId },
      include: { refreshTokens: true },
    });
    return;
  }

  async deleteSessions(where: Prisma.UserSessionWhereInput): Promise<void> {
    await this.db.userSession.deleteMany({ where });
    return;
  }

  async findRefreshToken(id: string) {
    return await this.db.sessionRefreshTokens.findFirst({
      where: { id },
    });
  }

  async updateRefreshToken(
    id: string,
    data: Prisma.SessionRefreshTokensUpdateInput,
  ) {
    return await this.db.sessionRefreshTokens.update({
      where: { id },
      data,
    });
  }

  async getRefreshTokenForSession(sessionId: string) {
    return await this.db.sessionRefreshTokens.findMany({
      where: { sessionId },
    });
  }

  async deleteRefreshToken(id: string) {
    try {
      return await this.db.sessionRefreshTokens.delete({ where: { id } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new BadRequestException('Something Went Wrong');
    }
  }

  async createRefreshToken(sessionId: string, expiresAt: Date) {
    return await this.db.sessionRefreshTokens.create({
      data: {
        sessionId,
        expiresAt,
      },
    });
  }
}
