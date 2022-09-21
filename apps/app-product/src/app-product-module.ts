import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configureGrpc, parsedEnvFile } from '@app/config';
import { ProductController } from './controllers';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: parsedEnvFile(),
    }),
    ClientsModule.register([
      {
        name: 'PRODUCT_PACKAGE',
        ...configureGrpc('product', 'product'),
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [],
})
export class AppProductModule {}
