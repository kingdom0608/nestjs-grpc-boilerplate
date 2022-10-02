import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserResponseType } from './user-response-type';

export class UserSignInInputType extends PickType(UserResponseType, ['email']) {
  @ApiProperty({ type: String, description: '비밀번호' })
  readonly password: string;
}
