import { Controller, Get } from '@nestjs/common';
import { UserService } from '../services';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getHello() {
    await this.userService.getHello();
    return 'ok';
  }
}
