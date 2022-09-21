import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import {
  configureGrpc,
  generateTypeormModuleOptions,
  parsedEnvFile,
} from '@app/lib-config';
import { ProductService } from './services';
import { ProductEntity } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: parsedEnvFile(),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => generateTypeormModuleOptions(),
    }),
    TypeOrmModule.forFeature([ProductEntity]),
    ClientsModule.register([
      {
        name: 'PRODUCT_PACKAGE',
        ...configureGrpc('product', 'product'),
      },
    ]),
  ],
  controllers: [ProductService],
  providers: [],
})
export class ProductModule {}
