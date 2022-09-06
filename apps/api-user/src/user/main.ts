import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { configureGrpc } from '@app/config';
import { UserModule } from './user-module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  await app.init();
  app.connectMicroservice<MicroserviceOptions>(configureGrpc('user', 'user'));
  await app.startAllMicroservices();
}

bootstrap();
