import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiProductService {
  getHello(): string {
    return 'Hello World!';
  }
}
