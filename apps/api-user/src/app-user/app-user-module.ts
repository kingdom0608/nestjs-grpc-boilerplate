import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import { configureGrpc, generateTypeormModuleOptions } from '@app/config';
import { UserModule } from '@app/user';
import { UserService } from './services';

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
    TypeOrmModule.forRootAsync({
      useFactory: () => generateTypeormModuleOptions(),
    }),
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        ...configureGrpc('user', 'user'),
      },
      {
        name: 'PRODUCT_PACKAGE',
        ...configureGrpc('product', 'product'),
      },
    ]),
    UserModule,
  ],
  controllers: [UserService],
  providers: [],
})
export class AppUserModule {}
