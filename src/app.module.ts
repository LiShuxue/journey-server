import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import config from './config/config';
import { MyMiddleware } from './middlewares/my.middleware';
import { LoggerModule } from './modules/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpInterceptor } from './interceptors/http.interceptor';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { AuthGuard } from './modules/auth/auth.guard';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BlogModule } from './modules/blog/blog.module';
import { CommonModule } from './modules/common/common.module';
import { TasksModule } from './modules/task/task.module';

@Module({
  // imports：当前模块所依赖的其他模块
  imports: [
    // 使用 @nestjs/config 做配置管理，加载不同的配置文件，作为全局模式。在别的地方通过 this.configService.get('xxx.yyy') 来获取配置
    ConfigModule.forRoot({
      isGlobal: true, // 其他模块使用的时候，无需import，可以直接注入到service
      load: [config],
    }),

    // 根模块使用日志模块，该模块是全局的
    LoggerModule,

    // 使用 MongooseModule 配置数据库，使用配置文件中的变量来连接数据库
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('db.journey');
        const uri = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

        return {
          uri,
        };
      },
    }),

    // 限流操作，使用@nestjs/throttler包，可以使用@SkipThrottle()跳过限流，@Throttle()装饰器可用于覆盖全局模块中的设置。配置以后，需要全局使用ThrottlerGuard
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get('throttler_ttl'),
          limit: configService.get('throttler_limit'),
        },
      ],
    }),

    // 通用模块，如上传下载等，还有首页homeInfo等接口
    CommonModule,

    // 引入定时任务的功能，引入定时任务的TaskModule
    ScheduleModule.forRoot(),
    // 定时任务模块
    TasksModule,

    // 授权模块，如登录，鉴权，token
    AuthModule,
    // 用户相关
    UserModule,
    // 博客相关
    BlogModule,
  ],
  controllers: [], // controllers：当前模块的控制器
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpInterceptor, // 全局注册您的拦截器
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter, // 全局注册您的过滤器
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // 限流守卫。多个守卫应该分开写，按先后顺序执行。
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // 全局注册守卫，防止新增加的接口忘了加鉴权
    },
  ], // providers：当前模块中提供的服务（一般是service）、提供者和其他可注入的对象
  exports: [], // 将当前模块的controller或者service导出，其他模块才可以导入当前模块，并使用该导入模块的controller和service
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MyMiddleware) // 可以使用多个中间件
      .forRoutes('*'); // 可以使用在特定的路径forRoutes('user')，或者特定的控制器forRoutes(CatsController)，或者是所有路径forRoutes('*')
  }
}
