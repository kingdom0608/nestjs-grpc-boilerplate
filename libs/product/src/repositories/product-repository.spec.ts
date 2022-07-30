import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductRepository } from '@app/product';
import { generateTypeormModuleOptions } from '@app/config/typeorm-config';

describe('productRepository', () => {
  let productRepository: ProductRepository;
  let app: TestingModule;
  let createdProduct;
  const testName = '맥북프로';

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
      ],
      providers: [ProductRepository],
    }).compile();

    productRepository = app.get<ProductRepository>(ProductRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it('createProduct', async () => {
    const result = await productRepository.createProduct({
      name: testName,
    });
    createdProduct = result;
    // console.log(result);
    expect(result.name).toEqual(testName);
  });

  it('getProductById', async () => {
    const result = await productRepository.getProductById(createdProduct.id);
    // console.log(result);
    expect(result.name).toEqual(testName);
  });

  it('deleteProductById', async () => {
    const result = await productRepository.deleteProductById(createdProduct.id);
    // console.log(result);
    expect(result.name).toEqual(testName);
  });
});
