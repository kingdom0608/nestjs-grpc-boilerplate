import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { configureGrpc } from '@app/config';
import { AppProductModule } from './app-product-module';

async function bootstrap() {
  const app = await NestFactory.create(AppProductModule);
  await app.init();
  app.connectMicroservice<MicroserviceOptions>(
    configureGrpc('product', 'product'),
  );
  await app.startAllMicroservices();
}

bootstrap();
