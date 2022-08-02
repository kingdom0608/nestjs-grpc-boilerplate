import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities';
import { GrpcMethod } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * 유저 생성
   * @param userData
   * @return Promise<UserEntity>
   */
  async createUser(userData: {
    email: string;
    password: string;
  }): Promise<UserEntity> {
    return this.userRepository.save({
      email: userData.email,
      password: userData.password,
      status: 'ACTIVE',
    });
  }

  /**
   * 유저 아이디 조회
   * @param id
   * @return Promise<UserEntity>
   */
  async getUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  /**
   * 유저 이메일 조회
   * @param email
   * @return Promise<UserEntity>
   */
  @GrpcMethod('UserService', 'GetUserByEmail')
  async getUserByEmail({ email: email }): Promise<UserEntity> {
    return await this.userRepository.findOne({
      email: email,
    });
  }

  /**
   * 유저 삭제
   * @param id
   * @return Promise<UserEntity>
   */
  async deleteUserById(id: number): Promise<UserEntity> {
    const user = await this.getUserById(id);

    /** 유저 삭제 */
    await this.userRepository.delete(id);

    return user;
  }
}
