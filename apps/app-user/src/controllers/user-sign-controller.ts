import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestType,
  ConflictType,
  ForbiddenType,
  NotFoundType,
  ServerErrorType,
  UnauthorizedType,
  UserSignInInputType,
  UserSignResponseType,
} from '../user/types';
import { ClientGrpc } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { UserService } from '../user/services';
import {
  GrpcUserNotFoundException,
  GrpcUserPasswordWrongException,
} from '../user/exceptions';
import { AuthenticationService } from '@app/authentication';

@ApiTags('유저 회원')
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  type: BadRequestType,
})
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  type: UnauthorizedType,
})
@ApiResponse({
  status: HttpStatus.FORBIDDEN,
  type: ForbiddenType,
})
@ApiResponse({
  status: HttpStatus.NOT_FOUND,
  type: NotFoundType,
})
@ApiResponse({
  status: HttpStatus.CONFLICT,
  type: ConflictType,
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  type: ServerErrorType,
})
@Controller()
export class UserSignController implements OnModuleInit {
  private userService;

  constructor(
    @Inject('USER_PACKAGE') private readonly userClient: ClientGrpc,
    private readonly authenticationService: AuthenticationService,
  ) {}

  onModuleInit() {
    this.userService = this.userClient.getService<UserService>('UserService');
  }

  @ApiOperation({ summary: '유저 기본 로그인' })
  @ApiOkResponse({ type: UserSignResponseType })
  @Post('/user/signIn/basic')
  async signInForBasic(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: UserSignInInputType,
  ) {
    try {
      const { email, password } = dto;

      /** 아이디 체크 */
      await this.userService
        .getActiveUserByEmail({
          email: email,
        })
        .toPromise()
        .catch((err) => {
          if (err.message.includes('undefined')) {
            throw new GrpcUserNotFoundException();
          } else {
            throw err;
          }
        });

      /** 비밀번호 체크 */
      const user = await this.userService
        .getUserByEmailPassword({
          email,
          password,
        })
        .toPromise()
        .catch((err) => {
          if (err.message.includes('undefined')) {
            throw new GrpcUserPasswordWrongException();
          } else {
            throw err;
          }
        });

      const issueToken = await this.authenticationService.issueToken(user.id);

      return res.json({
        result: 'ok',
        status: HttpStatus.OK,
        data: {
          user: user,
          accessToken: issueToken.accessToken,
          refreshToken: issueToken.refreshToken,
        },
      });
    } catch (err) {
      if (!(err instanceof HttpException)) {
        switch (err.error.code) {
          case 5:
            throw new HttpException(
              {
                status: HttpStatus.NOT_FOUND,
                message: err.message,
                error: err.message,
              },
              HttpStatus.NOT_FOUND,
            );
          default:
            throw new HttpException(
              {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'server error',
                error: err.message,
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      }
    }
  }
}
