import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { CacheService } from './cache.service';
import { Reflector } from '@nestjs/core';
import { mergeMap, Observable } from 'rxjs';
import { RequestWithUser } from 'src/auth/types/request-with-user';

@Injectable()
export class InvalidateCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cache: CacheService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    if (req.method === 'GET') return next.handle();

    const tags =
      this.reflector.get<string[]>(INVALIDATE_TAGS, context.getHandler()) ?? [];

    return next.handle().pipe(
      mergeMap(async (data) => {
        for (const tag of tags) {
          const keys = await this.cache.getKeysByTag(tag);

          for (const key of keys) {
            await this.cache.del(key);
          }

          await this.cache.clearTag(tag);
          Logger.log(`Invalidated cache tag: ${tag}`);
        }
        return data as Response;
      }),
    );
  }
}

export const INVALIDATE_TAGS = 'invalidate-cache-tags';

export const InvalidateRouteCache = (tags: string[]) =>
  applyDecorators(
    SetMetadata(INVALIDATE_TAGS, tags),
    UseInterceptors(InvalidateCacheInterceptor),
  );
