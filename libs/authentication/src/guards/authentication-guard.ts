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
    await this.authenticationStrategy.decodeToken(
      request.headers['x-access-token'],
    );

    return true;
  }
}
