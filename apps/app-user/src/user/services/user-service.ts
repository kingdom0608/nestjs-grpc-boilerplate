import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GrpcMethod } from '@nestjs/microservices';
import { EncryptUtil } from '@app/util';
import { Connection, Repository } from 'typeorm';
import { UserEntity } from '../entities';
import { UserStatus } from '../enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly encryptUtil: EncryptUtil,
    private connection: Connection,
  ) {}

  /**
   * 유저 생성
   * @param userData
   * @return Promise<UserEntity>
   */
  @GrpcMethod('UserService', 'CreateUser')
  async createUser(userData: {
    email: string;
    password?: string;
    name: string;
    provider: string;
  }): Promise<UserEntity> {
    return this.userRepository.save({
      email: userData.email,
      password: userData.password
        ? this.encryptUtil.encryptForPassword(userData.password)
        : null,
      name: userData.name,
      provider: userData.provider,
      status: UserStatus.ACTIVE,
    });
  }

  /**
   * 유저 존재 유무
   * @param email: string
   */
  @GrpcMethod('UserService', 'IsExistUserByEmail')
  async isExistUserByEmail({ email: email }): Promise<{
    isExist: boolean;
  }> {
    let isExist = false;

    /** 유저 이메일 조회 */
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      isExist = true;
    }

    return {
      isExist: isExist,
    };
  }

  /**
   * 유저 아이디 조회
   * @param id: number
   * @return Promise<UserEntity>
   */
  @GrpcMethod('UserService', 'GetUserById')
  async getUserById({ id: id }): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  /**
   * 유저 이메일 조회
   * @param email: string
   * @return Promise<UserEntity>
   */
  @GrpcMethod('UserService', 'GetUserByEmail')
  async getUserByEmail({ email: email }): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  /**
   * 유저 이메일&비밀번호 조회
   * @param email: string
   * @param password: string
   */
  @GrpcMethod('UserService', 'GetUserByEmailPassword')
  async getUserByEmailPassword({
    email: email,
    password: password,
  }): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        email: email,
        password: this.encryptUtil.encryptForPassword(password),
      },
    });
  }

  /**
   * 활성 유저 이메일 조회
   * @param email: string
   */
  @GrpcMethod('UserService', 'GetActiveUserByEmail')
  async getActiveUserByEmail({ email: email }): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { email: email, status: UserStatus.ACTIVE },
    });
  }

  /**
   * 유저 소프트 삭제 변경
   * @param id: number
   */
  @GrpcMethod('UserService', 'SoftDeleteUserById')
  async softDeleteUserById({ id: id }) {
    await this.connection.transaction(async () => {
      /** 유저 상태 업데이트 */
      await this.userRepository.update(
        {
          id: id,
        },
        {
          status: UserStatus.DELETE,
        },
      );

      /** 유저 소프트 삭제 */
      await this.userRepository.softDelete({
        id: id,
      });
    });

    return this.userRepository.findOne({
      where: {
        id: id,
      },
      withDeleted: true,
    });
  }

  /**
   * 유저 삭제
   * @param id: number
   * @return Promise<UserEntity>
   */
  async deleteUserById({ id: id }): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      withDeleted: true,
    });

    /** 유저 삭제 */
    await this.userRepository.delete({
      id: id,
    });

    return user;
  }
}
