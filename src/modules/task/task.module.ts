import { Module } from '@nestjs/common';
import { BackupTaskService } from './backupTask.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [BackupTaskService],
})
export class TasksModule {}
