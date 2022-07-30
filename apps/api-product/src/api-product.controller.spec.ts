import { Test, TestingModule } from '@nestjs/testing';
import { ApiProductController } from './api-product.controller';
import { ApiProductService } from './api-product.service';

describe('ApiProductController', () => {
  let apiProductController: ApiProductController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApiProductController],
      providers: [ApiProductService],
    }).compile();

    apiProductController = app.get<ApiProductController>(ApiProductController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(apiProductController.getHello()).toBe('Hello World!');
    });
  });
});
