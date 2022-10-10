import { ApiProperty } from '@nestjs/swagger';

export class UserResponseType {
  @ApiProperty({ type: Number, description: '아이디' })
  readonly id: number;

  @ApiProperty({ type: String, description: '이메일' })
  readonly email: string;

  @ApiProperty({ type: String, description: '이름' })
  readonly name: string;

  @ApiProperty({
    type: String,
    description: '제공자',
    enum: ['BASIC', 'KAKAO'],
  })
  readonly provider: string;

  @ApiProperty({
    type: String,
    description: '상태',
    default: 'ACTIVE',
    enum: ['ACTIVE', 'INACTIVE'],
  })
  readonly status: string;

  @ApiProperty({ type: Date, description: '생성 일자' })
  readonly createdDate: Date;

  @ApiProperty({ type: Date, description: '갱신 일자' })
  readonly updatedDate: Date;
}
