import { Role, User, UserSession } from '@prisma/client';
import { Request } from 'express';

export type UserWithRole = User & { Role: Role[] };

export interface RequestWithUser extends Request {
  user: UserWithRole;
  session: UserSession;
}
