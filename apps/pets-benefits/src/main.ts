import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiVersion = process.env.API_VERSION;
  const port = process.env.PORT || 3000;
  const typeorm = app.get(DataSource)

  typeorm.runMigrations()

  app.setGlobalPrefix(apiVersion);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${apiVersion}`
  );
}

bootstrap();
