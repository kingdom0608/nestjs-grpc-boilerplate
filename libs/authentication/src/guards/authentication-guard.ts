import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationStrategy } from '@app/authentication/strategies';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly authenticationStrategy: AuthenticationStrategy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    /** 권한 조회 */
    const decodeToken = await this.authenticationStrategy.decodeToken(
      request.headers['x-access-token'],
    );

    /** 헤더에 유저 아이디 입력 */
    request.user = {
      id: decodeToken.userId,
    };

    return true;
  }
}
