import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { configureGrpc } from '@app/config';
import { ApiUserModule } from './api-user-module';
import { UserModule } from './user/user-module';
import { setupSwagger } from '../../../swagger';

async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create<NestExpressApplication>(ApiUserModule, {
    cors: true,
  });
  const userApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      ...configureGrpc('user', 'user'),
    },
  );

  setupSwagger(app, 'user');
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
  await userApp.listen();

  console.log(`🚀 server ready at http://localhost:${port} 🚀`);
}

bootstrap();
