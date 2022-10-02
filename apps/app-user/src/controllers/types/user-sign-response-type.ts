import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserResponseType } from './user-response-type';

export class UserSignResponseType extends PartialType(UserResponseType) {
  @ApiProperty({ type: String, description: '엑세스 토큰' })
  readonly accessToken: string;

  @ApiProperty({ type: String, description: '리프레시 토큰' })
  readonly refreshToken: string;
}
