import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { configureGrpc } from '@app/config';
import { ApiProductModule } from './api-product-module';
import { ProductModule } from './product/product-module';
import { setupSwagger } from '../../../swagger';

async function bootstrap() {
  const port = process.env.STAGE === 'prod' ? 3000 : 3001;
  const app = await NestFactory.create<NestExpressApplication>(
    ApiProductModule,
    {
      cors: true,
    },
  );
  const productApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProductModule,
    {
      ...configureGrpc('product', 'product'),
    },
  );

  setupSwagger(app, 'product');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: () => {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: '잘못된 요청',
            error: 'invalid parameter',
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  app.disable('x-powered-by');
  app.use('/ping', async function (req: any, res: any) {
    res.status(200).send('ok');
  });

  await app.listen(port);
  await productApp.listen();

  console.log(`🚀 server ready at http://localhost:${port} 🚀`);
}

bootstrap();
