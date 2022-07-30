import { NestFactory } from '@nestjs/core';
import { ApiProductModule } from './api-product.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiProductModule);
  await app.listen(3000);
}
bootstrap();
