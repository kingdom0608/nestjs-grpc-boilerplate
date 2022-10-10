import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthenticationGuard, CurrentUser } from '@app/authentication';
import { Request, Response } from 'express';
import {
  BadRequestType,
  ConflictType,
  ForbiddenType,
  NotFoundType,
  ServerErrorType,
  UnauthorizedType,
  UserResponseType,
} from './types';
import { UserService } from '../user/services';
import { GrpcUserNotFoundException } from '../user/exceptions';
import { ProductService } from '../../../app-product/src/product/services';

@ApiTags('유저')
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
export class UserController implements OnModuleInit {
  private userService;
  private productService;

  constructor(
    @Inject('USER_PACKAGE') private readonly userClient: ClientGrpc,
    @Inject('PRODUCT_PACKAGE') private readonly productClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService = this.userClient.getService<UserService>('UserService');
    this.productService =
      this.productClient.getService<ProductService>('ProductService');
  }

  @ApiOperation({ summary: '유저 조회' })
  @ApiOkResponse({ type: UserResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @Get('/user')
  async getUserByEmail(
    @CurrentUser() currentUser,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService
        .getUserById({
          id: currentUser.id,
        })
        .toPromise()
        .catch((err) => {
          if (err.message.includes('undefined')) {
            throw new GrpcUserNotFoundException();
          } else {
            throw err;
          }
        });

      /** product gRPC 통신 부분 */
      // await this.productService
      //   .getProductById({
      //     id: 2, // 테스트 위한 고정 값
      //   })
      //   .toPromise();

      return res.json({
        result: 'ok',
        status: HttpStatus.OK,
        data: {
          user: user,
        },
      });
    } catch (err) {
      if (!(err instanceof HttpException)) {
        switch (err.error.message) {
          case '존재하지 않는 유저입니다.':
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

  @ApiOperation({ summary: '유저 소프트 삭제' })
  @ApiOkResponse({ type: UserResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @Post('/user')
  async softDeleteUser(
    @CurrentUser() currentUser,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      console.log(currentUser);
      const user = await this.userService
        .softDeleteUserById({
          id: currentUser.id,
        })
        .toPromise()
        .catch((err) => {
          if (err.message.includes('undefined')) {
            throw new GrpcUserNotFoundException();
          } else {
            throw err;
          }
        });

      return res.json({
        result: 'ok',
        status: HttpStatus.OK,
        data: {
          user: user,
        },
      });
    } catch (err) {
      if (!(err instanceof HttpException)) {
        switch (err.error.message) {
          case '존재하지 않는 유저입니다.':
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
