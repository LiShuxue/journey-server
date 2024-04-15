import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [BackupService],
})
export class TasksModule {}
