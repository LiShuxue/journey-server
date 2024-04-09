import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { QiniuModule } from '../qiniu/qiniu.module';

@Module({
  imports: [QiniuModule],
  providers: [BackupService],
})
export class TasksModule {}
