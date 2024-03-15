import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import config from './config/config';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  // imports：当前模块所依赖的其他模块
  imports: [
    // 使用 @nestjs/config 做配置管理，加载不同的配置文件，作为全局模式。在别的地方通过 this.configService.get('xxx.yyy') 来获取配置
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    UserModule,
  ],
  controllers: [], // controllers：当前模块的控制器
  providers: [], // providers：当前模块中提供的服务（一般是service）、提供者和其他可注入的对象
  exports: [], // 将当前模块的controller或者service导出，其他模块才可以导入当前模块，并使用该导入模块的controller和service
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // 可以使用多个中间件
      .forRoutes('*'); // 可以使用在特定的路径forRoutes('user')，或者特定的控制器forRoutes(CatsController)，或者是所有路径forRoutes('*')
  }
}
