import { Global, Module } from '@nestjs/common';
import { MyLoggerService } from './logger.service';

@Global()
@Module({
  providers: [MyLoggerService],
  exports: [MyLoggerService], // 导出LoggerService，这样可以在其他模块中使用该Service
})
export class LoggerModule {}
