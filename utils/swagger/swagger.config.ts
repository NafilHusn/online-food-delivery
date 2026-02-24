import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
): void {
  if (configService.get<string>('NODE_ENV') !== 'development') return;

  const url = configService.get('BACKEND_URL') as string;

  const config = new DocumentBuilder()
    .setTitle('Online Food Delivery API')
    .setDescription('API documentation for Online Food Delivery system')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(url)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}
