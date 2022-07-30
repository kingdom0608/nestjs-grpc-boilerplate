import { Controller, Get } from '@nestjs/common';
import { ApiProductService } from './api-product.service';

@Controller()
export class ApiProductController {
  constructor(private readonly apiProductService: ApiProductService) {}

  @Get()
  getHello(): string {
    return this.apiProductService.getHello();
  }
}
