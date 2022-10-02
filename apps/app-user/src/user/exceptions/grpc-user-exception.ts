import * as grpc from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

/**
 * gRPC 존재하지 않는 유저 예외처리
 */
export class GrpcUserNotFoundException extends RpcException {
  public constructor() {
    const message = '존재하지 않는 유저입니다.';
    super({
      code: grpc.status.NOT_FOUND,
      message,
    });
  }
}

/**
 * gRPC 유저 비밀번호 불일치 오류 예외처리
 */
export class GrpcUserPasswordWrongException extends RpcException {
  public constructor() {
    const message = '유저 비밀번호가 올바르지 않습니다.';
    super({
      code: grpc.status.NOT_FOUND,
      message,
    });
  }
}
