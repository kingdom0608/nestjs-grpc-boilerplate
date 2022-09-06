import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GrpcMethod } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  /**
   * 상품 생성
   * @param productData
   * @return Promise<ProductEntity>
   */
  async createProduct(productData: { name: string }): Promise<ProductEntity> {
    return await this.productRepository.save({
      name: productData.name,
      status: 'ACTIVE',
    });
  }

  /**
   * 상품 아이디 조회
   * @param id
   * @return Promise<ProductEntity>
   */
  @GrpcMethod('ProductService', 'GetProductById')
  async getProductById({ id: id }): Promise<ProductEntity> {
    return await this.productRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  /**
   * 상품 삭제
   * @param id
   * @return Promise<ProductEntity>
   */
  async deleteProductById(id: number): Promise<ProductEntity> {
    const product = await this.getProductById({
      id: id,
    });

    /** 상품 삭제 */
    await this.productRepository.delete(id);

    return product;
  }
}
