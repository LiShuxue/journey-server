import { Module } from '@nestjs/common';
import { QiniuService } from './qiniu.service';

@Module({
  imports: [],
  providers: [QiniuService],
  exports: [QiniuService],
})
export class QiniuModule {}
