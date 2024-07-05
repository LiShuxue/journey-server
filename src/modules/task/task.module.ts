import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { EmailModule } from '../email/email.module';
import { SendEamilTaskService } from './sendEmailTask.service';

@Module({
  imports: [CommonModule, EmailModule],
  providers: [SendEamilTaskService],
})
export class TasksModule {}
