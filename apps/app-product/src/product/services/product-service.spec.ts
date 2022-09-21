import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import { generateTypeormModuleOptions } from '@app/lib-config/typeorm-config';
import { ProductService } from './product-service';
import { ProductEntity } from '../entities';

describe('productService', () => {
  let productService: ProductService;
  let app: TestingModule;
  let createdProduct;
  const testName = faker.internet.userName();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
        TypeOrmModule.forRootAsync({
          useFactory: () => generateTypeormModuleOptions(),
        }),
        TypeOrmModule.forFeature([ProductEntity]),
      ],
      providers: [ProductService],
    }).compile();

    productService = app.get<ProductService>(ProductService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('createProduct', async () => {
    const result = await productService.createProduct({
      name: testName,
    });
    createdProduct = result;
    // console.log(result);
    expect(result.name).toEqual(testName);
  });

  it('getProductById', async () => {
    const result = await productService.getProductById({
      id: createdProduct.id,
    });
    // console.log(result);
    expect(result.name).toEqual(testName);
  });

  it('deleteProductById', async () => {
    const result = await productService.deleteProductById(createdProduct.id);
    // console.log(result);
    expect(result.name).toEqual(testName);
  });
});
