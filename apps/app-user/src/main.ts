import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { configureGrpc } from '@app/config';
import * as fs from 'fs';
import { AppUserModule } from './app-user-module';
import { UserModule } from './user/user-module';
import { setupSwagger } from '../../../swagger';

async function bootstrap() {
  const port = process.env.STAGE === 'prod' ? 3000 : 3000;
  const file = './package.json';
  const packageJsonData = JSON.parse(fs.readFileSync(file, 'utf8'));
  const app = await NestFactory.create<NestExpressApplication>(AppUserModule, {
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

  console.log(`✅ server ready at http://localhost:${port}`);
  console.log(
    `✅ swagger ready at http://localhost:${port}/app-user/${packageJsonData.version}/docs`,
  );
}

bootstrap();
