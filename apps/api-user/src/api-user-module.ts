import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { configureGrpc } from '@app/config';
import { UserController } from './controllers';

/**
 * 환경변수 파일 파싱
 */
function parsedEnvFile() {
  switch (process.env.NODE_ENV) {
    case 'prod':
      return 'env/prod.env';
    case 'dev':
      return 'env/dev.env';
    case 'local':
      return 'env/local.env';
    case 'test':
      return 'env/test.env';
    default:
      throw new Error('env type is wrong');
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: parsedEnvFile(),
    }),
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        ...configureGrpc('user', 'user'),
      },
    ]),
  ],
  controllers: [UserController],
  providers: [],
})
export class ApiUserModule {}
