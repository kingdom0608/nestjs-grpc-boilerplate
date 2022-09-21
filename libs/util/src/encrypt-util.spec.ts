import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { EncryptUtil } from '@app/util/encrypt-util';

describe('encryptUtil', () => {
  let encryptUtil: EncryptUtil;
  let encryptedData;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
        EncryptUtil,
      ],
      controllers: [],
      providers: [],
    }).compile();

    encryptUtil = app.get<EncryptUtil>(EncryptUtil);
  });

  it('encryptForPassword', () => {
    const result = encryptUtil.encryptForPassword('encryptPassword');
    // console.log(result);
    expect(result).toEqual('b75e2e4a5a57995973d830f525360dbc34859295');
  });

  it('encrypt', () => {
    const result = encryptUtil.encrypt('encrypt');
    // console.log(result);
    encryptedData = result;
    expect(result.length).toEqual(44);
  });

  it('decrypt', () => {
    const result = encryptUtil.decrypt(encryptedData);
    // console.log(result);
    expect(result).toEqual('encrypt');
  });
});
