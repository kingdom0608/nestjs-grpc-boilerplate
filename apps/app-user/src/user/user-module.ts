import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import {
  configureGrpc,
  generateTypeormModuleOptions,
  parsedEnvFile,
} from '@app/config';
import { UtilModule } from '@app/util';
import { UserEntity } from './entities';
import { UserService } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: parsedEnvFile(),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => generateTypeormModuleOptions(),
    }),
    TypeOrmModule.forFeature([UserEntity]),
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
    UtilModule,
  ],
  controllers: [UserService],
  providers: [],
})
export class UserModule {}
