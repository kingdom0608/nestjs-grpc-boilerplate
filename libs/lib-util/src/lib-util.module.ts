import { Module } from '@nestjs/common';
import { LibUtilService } from './lib-util.service';

@Module({
  providers: [LibUtilService],
  exports: [LibUtilService],
})
export class LibUtilModule {}
