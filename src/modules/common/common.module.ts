import { Module } from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { CommonController } from './common.controller';
import { HttpModule } from '@nestjs/axios';
import { TencentService } from './tencent.service';

@Module({
  imports: [HttpModule],
  controllers: [CommonController],
  providers: [QiniuService, TencentService],
  exports: [QiniuService], // 要在别的地方使用，主要是backup那里，要用到上传
})
export class CommonModule {}
