import { HttpException, HttpStatus } from '@nestjs/common';
import { UserErrorMessage } from '../enums';

/**
 * http 유저 예외처리
 */
export class HttpUserException {
  public constructor(err) {
    if (!(err instanceof HttpException)) {
      let errMessage = err.error ? err.error.message : err.message;
      errMessage = err.code ? err.details : errMessage;

      switch (errMessage) {
        case UserErrorMessage.UNAUTHORIZED:
          throw new HttpException(
            {
              code: '40304',
              status: HttpStatus.UNAUTHORIZED,
              message: errMessage,
              error: err.message,
            },
            HttpStatus.UNAUTHORIZED,
          );
        case UserErrorMessage.NOT_FOUND:
          throw new HttpException(
            {
              code: '40401',
              status: HttpStatus.NOT_FOUND,
              message: errMessage,
              error: err.message,
            },
            HttpStatus.NOT_FOUND,
          );
        case UserErrorMessage.CONFLICT:
          throw new HttpException(
            {
              code: '40901',
              status: HttpStatus.CONFLICT,
              message: errMessage,
              error: err.message,
            },
            HttpStatus.CONFLICT,
          );
        default:
          throw new HttpException(
            {
              code: '500',
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              message: 'server error',
              error: err.message,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    } else {
      throw err;
    }
  }
}
