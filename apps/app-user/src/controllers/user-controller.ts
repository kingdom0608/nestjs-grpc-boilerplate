import {
  Controller,
  Delete,
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
import {
  GrpcUserNotFoundException,
  HttpUserException,
} from '../user/exceptions';
import { ProductService } from '../../../app-product/src/product/services';
import { UserErrorMessage } from '../user/enums';

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
  async getUser(
    @CurrentUser() currentUser,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService
        .getUserById({
          id: currentUser.id,
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
      throw new HttpUserException(err);
    }
  }

  @ApiOperation({ summary: '유저 소프트 삭제' })
  @ApiOkResponse({ type: UserResponseType })
  @ApiBearerAuth('authentication')
  @UseGuards(AuthenticationGuard)
  @Delete('/user')
  async softDeleteUser(
    @CurrentUser() currentUser,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService
        .softDeleteUserById({
          id: currentUser.id,
        })
        .toPromise();

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
}
