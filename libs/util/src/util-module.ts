import { Module } from '@nestjs/common';
import { EncryptUtil } from '@app/util/encrypt-util';

@Module({
  providers: [EncryptUtil],
  exports: [EncryptUtil],
})
export class UtilModule {}
