import { ApiProperty } from '@nestjs/swagger';

export class BadRequestType {
  @ApiProperty({ example: 400 })
  status: number;

  @ApiProperty({ example: 'error message' })
  message: string;

  @ApiProperty({ example: 'error description' })
  error: string;
}

export class UnauthorizedType {
  @ApiProperty({ example: 401 })
  status: number;

  @ApiProperty({ example: 'error message' })
  message: string;

  @ApiProperty({ example: 'error description' })
  error: string;
}

export class ForbiddenType {
  @ApiProperty({ example: 403 })
  status: number;

  @ApiProperty({ example: 'error message' })
  message: string;

  @ApiProperty({ example: 'error description' })
  error: string;
}

export class NotFoundType {
  @ApiProperty({ example: 404 })
  status: number;

  @ApiProperty({ example: 'error message' })
  message: string;

  @ApiProperty({ example: 'error description' })
  error: string;
}

export class ConflictType {
  @ApiProperty({ example: 409 })
  status: number;

  @ApiProperty({ example: 'error message' })
  message: string;

  @ApiProperty({ example: 'error description' })
  error: string;
}

export class ServerErrorType {
  @ApiProperty({ example: 500 })
  status: number;

  @ApiProperty({ example: 'sever error' })
  message: string;

  @ApiProperty({ example: 'error description' })
  error: string;
}
