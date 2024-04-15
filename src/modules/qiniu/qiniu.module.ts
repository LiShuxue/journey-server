import { Module } from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { QiniuController } from './qiniu.controller';

@Module({
  imports: [],
  controllers: [QiniuController],
  providers: [QiniuService],
  exports: [QiniuService], // 要在别的地方使用，主要是backup那里，要用到上传
})
export class QiniuModule {}
