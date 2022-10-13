import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { generateTypeormModuleOptions } from '@app/config';
import { SignService } from './sign-service';

describe('SignService', () => {
  let signService: SignService;
  let app: TestingModule;
  /** 카카오 에서 발급한 코드를 받아서 삽입
   * targetUrl: https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code
   */
  const code = '';

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
      providers: [SignService],
    }).compile();

    signService = app.get<SignService>(SignService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('signInForKakao', async () => {
    const result = await signService.signInForKakao(code);
    // console.log(result);
    expect(result).toHaveProperty('data');
  });
});
