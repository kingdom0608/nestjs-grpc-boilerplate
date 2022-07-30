import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@app/user';
import { generateTypeormModuleOptions } from '@app/config/typeorm-config';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './services';
import { UserController } from './controllers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'prod' ? 'env/prod.env' : `env/local.env`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => generateTypeormModuleOptions(),
    }),
    UserModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class ApiUserModule {}
