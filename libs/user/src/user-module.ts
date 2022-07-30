import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/entities';
import { UserRepository } from '@app/user/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UserRepository],
  providers: [UserRepository],
})
export class UserModule {}
