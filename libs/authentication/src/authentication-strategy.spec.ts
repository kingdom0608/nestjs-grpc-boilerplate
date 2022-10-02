import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationStrategy } from './authentication-strategy';
import { ConfigModule } from '@nestjs/config';

describe('AuthenticationStrategy', () => {
  let authenticationStrategy: AuthenticationStrategy;
  let issuedToken;
  const userId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
      ],
      providers: [AuthenticationStrategy],
    }).compile();

    authenticationStrategy = module.get<AuthenticationStrategy>(
      AuthenticationStrategy,
    );
  });

  it('issueToken', async () => {
    const result = await authenticationStrategy.issueToken(userId);
    // console.log(result);
    issuedToken = result;
    expect(result.visitorData).toEqual({
      key: issuedToken.key,
      userId: userId,
    });
  });

  it('decodeToken', () => {
    const result = authenticationStrategy.decodeToken(issuedToken.accessToken);
    // console.log(result);
    expect(result).toEqual({
      key: issuedToken.key,
      userId: userId,
    });
  });
});
