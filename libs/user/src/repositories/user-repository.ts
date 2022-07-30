import { Connection, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '@app/user/entities';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly connection: Connection) {
    super();
  }

  /**
   * 유저 생성
   * @param userData
   * @return Promise<UserEntity>
   */
  async createUser(userData: {
    email: string;
    password: string;
  }): Promise<UserEntity> {
    return await this.connection.getRepository(UserEntity).save({
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
    return await this.connection.getRepository(UserEntity).findOne({
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
  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.connection.getRepository(UserEntity).findOne({
      where: {
        email: email,
      },
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
    await this.connection.getRepository(UserEntity).delete(id);

    return user;
  }
}
