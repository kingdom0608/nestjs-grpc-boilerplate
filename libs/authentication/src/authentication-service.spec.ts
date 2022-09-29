import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication-service';
import { ConfigModule } from '@nestjs/config';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
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
      providers: [AuthenticationService],
    }).compile();

    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
  });

  it('issueToken', async () => {
    const result = await authenticationService.issueToken(userId);
    // console.log(result);
    issuedToken = result;
    expect(result.visitorData).toEqual({
      key: issuedToken.key,
      userId: userId,
    });
  });

  it('decodeToken', () => {
    const result = authenticationService.decodeToken(issuedToken.accessToken);
    // console.log(result);
    expect(result).toEqual({
      key: issuedToken.key,
      userId: userId,
    });
  });
});
