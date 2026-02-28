import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { mergeMap, Observable, of } from 'rxjs';
import { CacheService } from './cache.service';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from 'src/auth/types/request_with_user';
import { ConfigService } from '@nestjs/config';

export const CacheTTL = Reflector.createDecorator<number>();

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cache: CacheService,
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    if (req.method !== 'GET') return next.handle();
    const key = this.buildKey(req);

    // Skip caching if route has @NoCache / cache-control: no-cache / controller caching disabled
    let noCache = this.reflector.get<boolean>(NO_CACHE, context.getHandler());
    const cacheControl = req.headers['cache-control'];
    const cachingEnabled = this.config.get<boolean>(
      'CONTROLLER_CACHING_ENABLED',
    );
    if (cacheControl === 'no-cache') noCache = true;
    if (noCache || !cachingEnabled) {
      Logger.log(`${key} Cache Miss`);
      return next.handle();
    }

    const cached = await this.cache.get(key);
    if (cached) return of(cached);

    const tags =
      this.reflector.get<string[]>(CACHE_TAGS, context.getHandler()) ?? [];

    let ttl = 0;
    const cacheTTL = this.reflector.get<number | undefined>(
      CacheTTL,
      context.getHandler(),
    );
    // pass 0 to set no limit
    if (cacheTTL !== undefined) ttl = cacheTTL;

    return next.handle().pipe(
      mergeMap(async (response) => {
        await this.cache.set(key, response, ttl);
        for (const tag of tags) {
          await this.cache.addKeyToTag(tag, key);
        }
        return response as Response;
      }),
    );
  }

  private buildKey(req: RequestWithUser) {
    return `response:GET:${req.user?.id ?? 'global'}:${req.originalUrl}`;
  }
}

export const CACHE_TAGS = 'cache-tags';

export const CacheTags = (...tags: string[]) => SetMetadata(CACHE_TAGS, tags);

const NO_CACHE = 'no-cache';
export const NoCache = () => SetMetadata(NO_CACHE, true);
