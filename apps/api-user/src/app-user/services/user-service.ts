import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GrpcMethod } from '@nestjs/microservices';
import { UserRepository } from '@app/user';

@Controller()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * 유저 이메일 조회
   * @param email
   */
  @GrpcMethod('UserService', 'GetUserByEmail')
  async getUserByEmail({ email: email }): Promise<{
    id: number;
    email: string;
    status: string;
    createdDate: Date;
    updatedDate: Date;
  }> {
    const user = await this.userRepository.getUserByEmail(email);

    return {
      id: user.id,
      email: user.email,
      status: user.status,
      createdDate: user.createdDate,
      updatedDate: user.updatedDate,
    };
  }
}
