import { Test, TestingModule } from '@nestjs/testing';
import { LibUtilService } from './lib-util.service';

describe('LibUtilService', () => {
  let service: LibUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibUtilService],
    }).compile();

    service = module.get<LibUtilService>(LibUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
