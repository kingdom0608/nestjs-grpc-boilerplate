import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from '@app/user';
import { generateTypeormModuleOptions } from '@app/config/typeorm-config';

describe('userRepository', () => {
  let userRepository: UserRepository;
  let app: TestingModule;
  let createdUser;
  const testEmail = 'testemail@mausinsa.com';

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
        TypeOrmModule.forRootAsync({
          useFactory: () => generateTypeormModuleOptions(),
        }),
      ],
      providers: [UserRepository],
    }).compile();

    userRepository = app.get<UserRepository>(UserRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it('createUser', async () => {
    const result = await userRepository.createUser({
      email: testEmail,
      password: 'password',
    });
    createdUser = result;
    // console.log(result);
    expect(result.email).toEqual(testEmail);
  });

  it('getUserById', async () => {
    const result = await userRepository.getUserById(createdUser.id);
    // console.log(result);
    expect(result.email).toEqual(testEmail);
  });

  it('getUserByEmail', async () => {
    const result = await userRepository.getUserByEmail(testEmail);
    // console.log(result);
    expect(result.email).toEqual(testEmail);
  });

  it('deleteUserById', async () => {
    const result = await userRepository.deleteUserById(createdUser.id);
    // console.log(result);
    expect(result.email).toEqual(testEmail);
  });
});
