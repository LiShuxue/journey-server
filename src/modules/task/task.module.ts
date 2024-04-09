import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { LoggerModule } from '../logger/logger.module';
import { QiniuModule } from '../qiniu/qiniu.module';

@Module({
  imports: [LoggerModule, QiniuModule],
  providers: [BackupService],
})
export class TasksModule {}
