import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const apiVersion = configService.get<string>('API_VERSION');
  const port = configService.get<number>('PORT', 3000);
  const typeorm = app.get(DataSource);

  typeorm.runMigrations();

  app.setGlobalPrefix(apiVersion);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
    credentials: true,
  });

  app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${apiVersion}`
  );
}

bootstrap();
