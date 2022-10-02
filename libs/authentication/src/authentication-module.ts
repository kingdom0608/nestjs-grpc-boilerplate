import { Module } from '@nestjs/common';
import { AuthenticationGuard } from './authentication-guard';
import { AuthenticationStrategy } from './authentication-strategy';

@Module({
  providers: [AuthenticationStrategy, AuthenticationGuard],
  exports: [AuthenticationStrategy, AuthenticationGuard],
})
export class AuthenticationModule {}
