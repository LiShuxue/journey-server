import { Global, Module } from '@nestjs/common';
import { MyLoggerService } from './logger.service';

// 声明为全局的，任何地方都可以直接注入，而无需引入LoggerModule
@Global()
@Module({
  providers: [MyLoggerService],
  exports: [MyLoggerService], // 导出LoggerService，这样可以在其他模块中使用该Service
})
export class LoggerModule {}
