import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MyLoggerService } from './modules/logger/logger.service';
import { NestExpressApplication } from '@nestjs/platform-express';

/*
  Nestjs 是一个类似于Spring的框架。

  modules: 用来整合一个有关联性的业务功能。启动 NestJS 应用程序时，它会首先加载主模块（通常是根模块），然后递归加载所有与主模块关联的模块，依次初始化它们。
  controller: 负责处理传入的请求和向客户端返回响应。
  service: 负责具体的业务逻辑，包括数据存储和检索，数据计算等。
  provider: 只要是被 @Injectable() 装饰器注释的类，都是provider。提供者会被声明在 @Module 的 providers 中，将被依赖注入到 Controller 或者其他地方。

  middleware: 中间件是在路由处理程序 之前 调用的函数。可以访问请求和响应对象。这里拿到的就是客户端最初发的请求，和最终返回给客户端的响应。
  interceptor: 拦截器是实现 NestInterceptor 接口的类。用于 在请求到达控制器之前 或 响应返回客户端之前 添加额外的逻辑。它们可以用于修改请求或响应对象。
  filter: 过滤器一般用来处理所有的异常信息。能够在全局范围或特定控制器范围内捕获异常，并根据异常类型提供自定义的响应。它是响应返回给客户端的最后一次过滤。
  
  guard: 守卫是实现 CanActivate 接口的类，一般用来做鉴权，来确定请求是否可以继续。
  pipe: 管道是实现 PipeTransform 接口的类，用于在数据传递给控制器之前对其进行验证、转换和处理。管道要么返回数据验证或者转换后的值，要么抛出一个错误。当class-validator结合dto的验证不满足需求时，才需要自定义pipe。
  dto: DTO 的主要目的是提供一种清晰的方式来定义数据结构，并确保数据的一致性和有效性。DTO 可以用于验证传入请求的数据。通过定义输入 DTO，你可以明确地指定哪些字段是必需的，哪些字段是可选的，以及每个字段的验证规则。DTO 也可以用于格式化传出响应的数据。通过定义输出 DTO，你可以指定响应的数据结构，并确保响应的数据符合预期的格式。

  请求流动顺序：传入请求 -> 中间件 -> 守卫 —> req拦截器 -> 管道 -> 控制器 -> service -> res拦截器 -> 异常过滤器
*/

// main.ts 是应用程序入口文件。负责引导我们的应用程序
async function bootstrap() {
  // 使用 NestFactory 用来创建 Nest 应用实例，基于Express。一般不需要指定Express，但是因为我们要app.set('trust proxy', true)，这是express特有的。
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  // 获取全局配置，这个service是由 @nestjs/config 库提供
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  const trustProxy = configService.get('trustProxy');
  const allowOrigin = configService.get('allowOrigin');

  // 替换 app 默认的日志输出为自己的日志输出
  app.useLogger(new MyLoggerService());

  // 全局使用拦截器，但无法依赖注入
  // app.useGlobalInterceptors(new HttpInterceptor());

  // 全局使用过滤器，但无法依赖注入
  // app.useGlobalFilters(new HttpExceptionFilter());

  // 使用 enableCors() 方法来启用 CORS
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, allowOrigin);
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'refresh-token'],
    exposedHeaders: ['new-access-token', 'new-refresh-token'],
  });

  // 服务运行在代理之后，所以需要信任代理地址，这样才能拿到真实的客户端IP
  // 设置为 true 时，Express 会信任所有的代理头信息，而在设置为特定的 IP 地址时，Express 只信任来自指定 IP 地址的代理头信息。
  app.set('trust proxy', trustProxy);

  await app.listen(port);
}

bootstrap();
