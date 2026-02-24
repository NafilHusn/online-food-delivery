import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from '../utils/swagger/swagger.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const devMode = configService.get<string>('NODE_ENV') === 'development';
  const port = configService.get<number>('PORT') || 3000;
  if (devMode) {
    setupSwagger(app, configService);
  }

  await app.listen(port);

  const url = await app.getUrl();
  Logger.log(`Application is running on: ${url}`);
  if (devMode) {
    Logger.log(`Swagger documentation is available at: ${url}/docs`);
  }
}
bootstrap();
