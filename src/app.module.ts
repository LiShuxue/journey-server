import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { MongodbModule } from './mongodb/mongodb.module';
import AppConfig from './config/configuration';
import MongodbConfig from './config/mongodb';
import { logger } from './middlewares/logger.middleware';

@Module({
  imports: [
    // 使用@nestjs/config做配置管理，加载不同的配置文件，作为全局模式。在别的地方通过 this.configService.get('xxx.yyy') 来获取配置
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, MongodbConfig],
    }),
    MongodbModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(logger) // 可以使用多个中间件
      .forRoutes('*'); // 可以使用在特定的路径forRoutes('user')，或者特定的控制器forRoutes(CatsController)，或者是所有路径forRoutes('*')
  }
}
