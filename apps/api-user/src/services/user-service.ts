import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@app/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}
  async getHello() {
    const result = await this.userRepository.getUserByEmail('test@mausin.com');
    console.log(result);

    return 'ok';
  }
}
