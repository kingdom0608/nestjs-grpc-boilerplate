import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { configureGrpc, parsedEnvFile } from '@app/config';
import { AuthenticationModule } from '@app/authentication';
import { UserController, UserSignController } from './controllers';
import { SignService } from './user/services';

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
      {
        name: 'PRODUCT_PACKAGE',
        ...configureGrpc('product', 'product'),
      },
    ]),
    AuthenticationModule,
  ],
  controllers: [UserController, UserSignController],
  providers: [SignService],
})
export class AppUserModule {}
