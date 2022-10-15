import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  OnModuleInit,
  Post,
  Query,
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
  UserResponseType,
  UserSignInInputType,
  UserSignResponseType,
  UserSignUpInputType,
} from './types';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthenticationStrategy } from '@app/authentication';
import { Request, Response } from 'express';
import { SignService, UserService } from '../user/services';
import { HttpUserException } from '../user/exceptions';
import { UserErrorMessage } from '../user/enums';

@ApiTags('유저 회원가입/로그인')
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
    private readonly signService: SignService,
    private readonly authenticationStrategy: AuthenticationStrategy,
  ) {}

  onModuleInit() {
    this.userService = this.userClient.getService<UserService>('UserService');
  }

  @ApiOperation({ summary: '유저 기본 회원가입' })
  @ApiOkResponse({ type: UserResponseType })
  @Post('/user/signUp/basic')
  async signUpForBasic(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: UserSignUpInputType,
  ) {
    try {
      const { email, password, name } = dto;

      /** 유저 존재 여부 확인 */
      const isExistUser = await this.userService
        .isExistUserByEmail({
          email: email,
        })
        .toPromise();

      let user;
      if (isExistUser.isExist) {
        throw new Error(UserErrorMessage.CONFLICT);
      } else {
        user = await this.userService
          .createUser({
            email: email,
            password: password,
            name: name,
            provider: 'BASIC',
          })
          .toPromise();
      }

      return res.json({
        result: 'ok',
        status: HttpStatus.OK,
        data: {
          user: user,
        },
      });
    } catch (err) {
      throw new HttpUserException(err);
    }
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
        .toPromise();

      /** 비밀번호 체크 */
      const user = await this.userService
        .getUserByEmailPassword({
          email,
          password,
        })
        .toPromise();

      const issueToken = await this.authenticationStrategy.issueToken(user.id);

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
      throw new HttpUserException(err);
    }
  }

  @ApiOperation({ summary: '유저 카카오 회원가입' })
  @ApiOkResponse({ type: UserResponseType })
  @Get('/user/signUp/kakao')
  async signUpForKakao(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
  ) {
    try {
      /** 카카오 정보 조회 */
      const userResponse = await this.signService.signUpForKakao(code);

      /** 유저 존재 여부 확인 */
      const isExistUser = await this.userService
        .isExistUserByEmail({
          email: userResponse.data.kakao_account.email,
        })
        .toPromise();

      let user;
      if (isExistUser.isExist) {
        throw new Error(UserErrorMessage.CONFLICT);
      } else {
        user = await this.userService
          .createUser({
            email: userResponse.data.kakao_account.email,
            name: userResponse.data.kakao_account.profile.nickname,
            provider: 'KAKAO',
          })
          .toPromise();
      }

      return res.json({
        result: 'ok',
        status: HttpStatus.OK,
        data: {
          user: user,
        },
      });
    } catch (err) {
      throw new HttpUserException(err);
    }
  }

  @ApiOperation({ summary: '유저 카카오 로그인' })
  @ApiOkResponse({ type: UserSignResponseType })
  @Get('/user/signIn/kakao')
  async signInForKakao(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
  ) {
    try {
      /** 카카오 정보 조회 */
      const userResponse = await this.signService.signInForKakao(code);

      /** 유저 존재 여부 확인 */
      const isExistUser = await this.userService
        .isExistUserByEmail({
          email: userResponse.data.kakao_account.email,
        })
        .toPromise();

      /** 유저가 없을 경우 예외 처리 */
      if (isExistUser.isExist === false) {
        throw new Error(UserErrorMessage.NOT_FOUND);
      }

      /** 유저 & 토큰 조회 */
      const user = await this.userService
        .getUserByEmail({
          email: userResponse.data.kakao_account.email,
        })
        .toPromise();
      const issueToken = await this.authenticationStrategy.issueToken(user.id);

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
      throw new HttpUserException(err);
    }
  }
}
