import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from '@app/product';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * 상품 아이디 조회
   * @param id
   */
  @GrpcMethod('ProductService', 'GetProductById')
  async getProductById({ id: id }) {
    const product = await this.productRepository.getProductById(id);

    return {
      id: product.id,
      name: product.name,
      status: product.status,
      createdDate: product.createdDate,
      updatedDate: product.updatedDate,
    };
  }
}
