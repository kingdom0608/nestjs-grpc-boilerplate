import { Module } from '@nestjs/common';
import { ApiProductController } from './api-product.controller';
import { ApiProductService } from './api-product.service';

@Module({
  imports: [],
  controllers: [ApiProductController],
  providers: [ApiProductService],
})
export class ApiProductModule {}
