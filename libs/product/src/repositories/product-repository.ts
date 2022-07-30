import { Connection, EntityRepository, Repository } from 'typeorm';
import { ProductEntity } from '@app/product';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  constructor(private readonly connection: Connection) {
    super();
  }

  /**
   * 상품 생성
   * @param productData
   * @return Promise<ProductEntity>
   */
  async createProduct(productData: { name: string }): Promise<ProductEntity> {
    return await this.connection.getRepository(ProductEntity).save({
      name: productData.name,
      status: 'ACTIVE',
    });
  }

  /**
   * 상품 아이디 조회
   * @param id
   * @return Promise<ProductEntity>
   */
  async getProductById(id: number): Promise<ProductEntity> {
    return await this.connection.getRepository(ProductEntity).findOne({
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
    const product = await this.getProductById(id);

    /** 상품 삭제 */
    await this.connection.getRepository(ProductEntity).delete(id);

    return product;
  }
}
