import { ApiProperty } from '@nestjs/swagger';

export class UserSignUpInputType {
  @ApiProperty({ type: String, description: '이메일' })
  readonly email: string;

  @ApiProperty({ type: String, description: '비밀번호' })
  readonly password: string;

  @ApiProperty({ type: String, description: '이름' })
  readonly name: string;
}

export class UserSignInInputType {
  @ApiProperty({ type: String, description: '이메일' })
  readonly email: string;

  @ApiProperty({ type: String, description: '비밀번호' })
  readonly password: string;
}
