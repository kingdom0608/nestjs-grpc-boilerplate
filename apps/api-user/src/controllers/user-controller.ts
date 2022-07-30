import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../services';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users/:email')
  async getUserByEmail(
    @Param('email') email: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.getUserByEmail(email);

      return res.json({
        result: 'ok',
        status: HttpStatus.OK,
        data: {
          user: user,
        },
      });
    } catch (err) {
      throw err;
    }
  }
}
