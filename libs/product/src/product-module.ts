import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@app/product/entities';
import { ProductRepository } from '@app/product/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
