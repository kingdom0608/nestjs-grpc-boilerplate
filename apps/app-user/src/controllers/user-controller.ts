import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { UserService } from '../user/services';
import {
  BadRequestType,
  ConflictType,
  ForbiddenType,
  NotFoundType,
  ServerErrorType,
  UnauthorizedType,
  UserType,
} from '../user/types';
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

  @ApiOperation({ summary: '유저 이메일 조회' })
  @ApiOkResponse({ type: UserType })
  @ApiParam({
    name: 'email',
    required: true,
    description: '이메일',
  })
  @Get('/users/:email')
  async getUserByEmail(
    @Param('email') email: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService
        .getUserByEmail({
          email: email,
        })
        .toPromise();

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
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'server error',
            error: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw err;
    }
  }
}
