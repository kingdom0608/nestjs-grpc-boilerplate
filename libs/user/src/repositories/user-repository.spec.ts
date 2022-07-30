import { UserRepository } from '@app/user';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { generateTypeormModuleOptions } from '@app/config/typeorm-config';

describe('userRepository', () => {
  let userRepository: UserRepository;
  let app: TestingModule;
  let createdUser;
  const testEmail = 'test@mausin.com';

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
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
