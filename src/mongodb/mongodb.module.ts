import { Module } from '@nestjs/common';
import { MongodbService } from './mongodb.service';

@Module({
  providers: [MongodbService],
  exports: [MongodbService], // 对于工具类service，没有controller来处理请求，如果需要别的module使用，需要export。因为添加到 providers 数组中时，该提供者默认是私有的，即只能在当前模块中使用。
})
export class MongodbModule {}
