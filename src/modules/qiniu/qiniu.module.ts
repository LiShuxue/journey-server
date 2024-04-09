import { Module } from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [QiniuService],
  exports: [QiniuService],
})
export class QiniuModule {}
