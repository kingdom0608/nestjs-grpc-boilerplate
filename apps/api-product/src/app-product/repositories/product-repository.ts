import { EntityRepository, Repository } from 'typeorm';
import { ProductEntity } from '../entities';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {}
