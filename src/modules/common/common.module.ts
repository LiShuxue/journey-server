import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';

@Module({
  imports: [],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService], // 要在别的地方使用，主要是backup那里，要用到上传
})
export class CommonModule {}
