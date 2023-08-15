import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongodbService } from './mongodb/mongodb.service';
import { ConfigService } from '@nestjs/config';

/*
  Nestjs 是一个类似于Spring的框架。
  controller: 负责处理传入的请求和向客户端返回响应。
  provider: 只要是被 @Injectable() 装饰器注释的类，都是provider，可以通过 constructor 注入依赖关系。
  service: 负责具体的业务逻辑，包括数据存储和检索，数据计算等。
  modules: 用来整合一个有关联性的业务功能。
  middleware: 中间件是在路由处理程序 之前 调用的函数。
  filter: 异常过滤器用来处理所有的异常信息。
  pipe: 管道是实现 PipeTransform 接口的类，用来对输入数据做转换或验证。
  guard: 守卫是实现 CanActivate 接口的类，一般用来做鉴权。
  interceptor: 拦截器是实现 NestInterceptor 接口的类，用来拦截请求或者响应。

  请求流动顺序：传入请求 -> 中间件 -> 守卫 —> req拦截器 -> 管道 -> 控制器方法执行 -> 调用service -> 控制器返回响应 -> res拦截器 -> 异常过滤器 -> 服务器响应
*/
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 数据库启动和关闭的逻辑
  const mongodbService = app.get(MongodbService);
  await mongodbService.connect();
  process.on('SIGINT', async () => {
    await mongodbService.closeConnection();
    process.exit(0);
  });

  // 获取app配置
  const configService = app.get(ConfigService);
  const port = configService.get('appConfig.port');
  await app.listen(port);
}
bootstrap();
