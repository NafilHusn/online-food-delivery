import { Role, User, UserSession } from '@prisma/client';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User & { Role: Role[] };
  session: UserSession;
}
