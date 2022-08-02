import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { generateTypeormModuleOptions } from '@app/config';
import { ProductModule } from '@app/product';
import { ProductService } from './services';
import { ProductController } from './controllers';

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
    ProductModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ApiProductModule {}