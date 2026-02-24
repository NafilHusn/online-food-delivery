import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
class DatabaseService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit
{
  constructor(private readonly configService: ConfigService) {
    const isDevelopmentMode = configService.get('NODE_ENV') === 'development';
    const isDBLoggingEnabled = configService.get(
      'DB_LOGGING_ENABLED',
    ) as boolean;

    const connectionString = configService.get<string>('DATABASE_URL');
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log:
        isDevelopmentMode && isDBLoggingEnabled
          ? ['query', 'info', 'warn']
          : [],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async runTransaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.runTransaction(callback);
  }
}

export default DatabaseService;
