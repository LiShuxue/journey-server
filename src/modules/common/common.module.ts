import { Module } from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { CommonController } from './common.controller';
import { HttpModule } from '@nestjs/axios';
import { TencentService } from './tencent.service';
import { HtmlService } from './html.service';

@Module({
  imports: [HttpModule],
  controllers: [CommonController],
  providers: [QiniuService, TencentService, HtmlService],
  exports: [QiniuService, TencentService, HtmlService], // 要在别的地方使用，主要是定时任务那里
})
export class CommonModule {}
