import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@app/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * 유저 이메일 조회
   * @param email
   */
  async getUserByEmail(email: string): Promise<{
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
