import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import { generateTypeormModuleOptions } from '@app/config/typeorm-config';
import { UserService } from './user-service';
import { UserEntity } from '../entities';
import { UtilModule } from '@app/util';

describe('UserService', () => {
  let userService: UserService;
  let app: TestingModule;
  let createdUser;
  const testEmail = faker.internet.email();
  const testPassword = faker.internet.password();

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
        TypeOrmModule.forFeature([UserEntity]),
        UtilModule,
      ],
      providers: [UserService],
    }).compile();

    userService = app.get<UserService>(UserService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('createUser', async () => {
    const result = await userService.createUser({
      email: testEmail,
      password: testPassword,
    });
    createdUser = result;
    // console.log(result);
    expect(result.email).toEqual(testEmail);
  });

  it('getUserById', async () => {
    const result = await userService.getUserById(createdUser.id);
    // console.log(result);
    expect(result.email).toEqual(testEmail);
  });

  it('getUserByEmail', async () => {
    const result = await userService.getUserByEmail({
      email: testEmail,
    });
    // console.log(result);
    expect(result.email).toEqual(testEmail);
  });

  it('deleteUserById', async () => {
    const result = await userService.deleteUserById(createdUser.id);
    // console.log(result);
    expect(result.email).toEqual(testEmail);
  });
});
